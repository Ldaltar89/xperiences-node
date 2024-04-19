const UserContract = require("../models/UserContract.js");
const User = require("../models/User.js");
const Contract = require("../models/Contract.js");
const { sendUserContractEmail } = require("../config/email/emailServices.js");
const { generatePDF } = require("../config/pdf/pdfServices.js");
const configureCloudinary = require("../config/cloudinary/cloudinaryServices.js");
const { Readable } = require("stream");

// Llama a la función de configuración de Cloudinary
configureCloudinary();

const getUserContracts = async (req, res) => {
  const id = req.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }
    let userContracts;
    if (user.rol === "Administrador") {
      userContracts = await UserContract.findAll({
        include: [
          { model: User, as: "User", attributes: ["name", "lastname"] },
          { model: Contract, as: "Contract", attributes: ["name"] },
        ],
        attributes: { exclude: ["userId", "contractId"] },
      });
    } else {
      userContracts = await UserContract.findAll({
        where: { userId: id },
        include: [
          { model: User, as: "User", attributes: ["name", "lastname"] },
          { model: Contract, as: "Contract", attributes: ["name"] },
        ],
        attributes: { exclude: ["userId", "contractId"] },
      });
    }
    const modifiedUserContracts = userContracts.map((userContract) => {
      const { User, Contract, ...rest } = userContract.toJSON();
      return {
        ...rest,
        userId: User ? `${User.name} ${User.lastname}` : null,
        contractId: Contract ? Contract.name : null,
      };
    });
    return res
      .status(200)
      .json({ ok: true, userContracts: modifiedUserContracts });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const createUserContract = async (req, res) => {
  try {
    const { userId, contractId, contract, contract_signed, createdBy } =
      req.body;

    if (!userId || !contractId) {
      return res.status(400).json({
        ok: false,
        msg: "Se requieren los IDs de usuario y contrato.",
      });
    }

    const [user, contractData] = await Promise.all([
      User.findOne({
        where: { id: userId },
        attributes: ["name", "dni", "lastname", "email"],
      }),
      Contract.findOne({
        where: { id: contractId },
        attributes: ["name"],
      }),
    ]);

    if (!user || !contractData) {
      return res
        .status(404)
        .json({ ok: false, msg: "Usuario o contrato no encontrado." });
    }

    // Reemplazar variables en el contrato HTML
    const processedContract = contract
      .replace(/{name}/g, user ? user.name : "")
      .replace(/{dni}/g, user ? user.dni : "")
      .replace(/{lastname}/g, user ? user.lastname : "");

    // Generar el PDF con un nombre personalizado
    const pdfBuffer = await generatePDF(processedContract, user);
    const bufferStream = Readable.from(pdfBuffer);

    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    // Subir el stream a Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = configureCloudinary().uploader.upload_stream(
        {
          public_id: `${user.name}_${user.lastname}_${user.dni}`,
          resource_type: "auto",
          folder: `Contratos/${year}/${month}/${day}/Contratos_Asignados`,
          format: "pdf",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            console.log("Cloudinary URL:", result.secure_url);
            resolve(result);
          }
        }
      );

      bufferStream.pipe(uploadStream);
    });

    const cloudinaryUrl = uploadResult.secure_url;
    await sendUserContractEmail(user, pdfBuffer);

    const newUserContract = await UserContract.create({
      userId,
      contractId,
      contract: processedContract,
      contract_signed,
      createdBy,
      pdfUrl: cloudinaryUrl,
    });

    return res.status(201).json({
      ok: true,
      newUserContract: {
        ...newUserContract.toJSON(),
        userId: user ? `${user.name} ${user.lastname}` : null,
        contractId: contractData ? contractData.name : null,
        contract: processedContract,
        pdfUrl: cloudinaryUrl,
      },
      msg: "Contrato de usuario creado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const getUserContract = async (req, res) => {
  const { id } = req.params;
  try {
    const userContract = await UserContract.findOne({
      where: { id },
    });
    if (!userContract) {
      return res.status(401).json({
        ok: false,
        msg: error.message,
      });
    }
    return res.status(200).json({ ok: true, userContract });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const updateUserContract = async (req, res) => {
  const { id } = req.params;
  try {
    const userContract = await UserContract.findByPk(id);
    if (!userContract) {
      return res.status(404).json({
        ok: false,
        msg: "UserContract no encontrado",
      });
    }

    const { userId, contractId, createdBy } = req.body;

    if (!userId || !contractId) {
      return res.status(400).json({
        ok: false,
        msg: "Se requieren los IDs de usuario y contrato.",
      });
    }

    const [user, contractData] = await Promise.all([
      User.findOne({
        where: { id: userId },
        attributes: ["name", "dni", "lastname", "email"],
      }),
      Contract.findOne({
        where: { id: contractId },
        attributes: ["name"],
      }),
    ]);

    if (!user || !contractData) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario o contrato no encontrado.",
      });
    }

    // Verifica si se ha subido un nuevo PDF
    let cloudinaryUrl = userContract.pdfUrl;
    if (req.file) {
      const pdfBuffer = req.file.buffer;

      const d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      // Subir el nuevo PDF a Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = configureCloudinary().uploader.upload_stream(
          {
            public_id: `${user.name}_${user.lastname}_${user.dni}_Modificado`,
            resource_type: "auto",
            folder: `Contratos/${year}/${month}/${day}/Contratos_Firmados`,
            format: "pdf",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              console.log("Cloudinary URL:", result.secure_url);
              resolve(result);
            }
          }
        );

        const bufferStream = Readable.from(pdfBuffer);
        bufferStream.pipe(uploadStream);
      });

      cloudinaryUrl = uploadResult.secure_url;
    }

    userContract.userId = userId;
    userContract.contractId = contractId;
    userContract.contract_signed = cloudinaryUrl;
    userContract.createdBy = createdBy;

    await userContract.save();

    return res.status(200).json({
      ok: true,
      userContract: {
        ...userContract.toJSON(),
        userId: `${user.name} ${user.lastname}`,
        contractId: contractData.name,
      },
      msg: "UserContract actualizado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const deleteUserContract = async (req, res) => {
  const { id } = req.params;
  try {
    const userContract = await UserContract.findOne({
      where: { id },
      include: [
        { model: User, as: "User", attributes: ["name", "lastname"] },
        { model: Contract, as: "Contract", attributes: ["name"] },
      ],
      attributes: { exclude: ["userId", "contractId"] },
    });
    if (!userContract) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del contrato del usuario",
      });
    }

    const [row] = await UserContract.update(
      { isActive: false },
      { where: { id } }
    );
    if (row > 0) {
      const { User, Contract, ...rest } = userContract.toJSON();
      const userId = User ? `${User.name} ${User.lastname}` : null;
      const contractId = Contract ? Contract.name : null;
      return res.status(200).json({
        ok: true,
        userContract: { ...rest, userId, contractId },
        msg: "Eliminado Correctamente",
      });
    } else {
      return res.status(404).json({
        ok: false,
        msg: "No se pudo eliminar el contrato del usuario",
      });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = {
  getUserContracts,
  createUserContract,
  getUserContract,
  updateUserContract,
  deleteUserContract,
};
