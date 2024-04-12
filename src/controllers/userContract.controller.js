const UserContract = require("../models/UserContract.js");
const User = require("../models/User.js");
const Contract = require("../models/Contract.js");
const {
  sendUserContractEmailUpdate,
  sendUserContractEmail,
} = require("../config/email/emailServices.js");
const { generatePDF } = require("../config/pdf/pdfServices.js");
const path = require("path");

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
    // if (!userContracts || userContracts.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ ok: false, msg: "No se encontraron userContracts" });
    // }
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
    const { userId, contractId, contract, contract_signed, createdBy } = req.body;

    // Obtener datos de usuario desde la base de datos
    // const user = await User.findOne({
    //   where: { id: userId },
    //   attributes: ["name", "dni", "lastname", "email"],
    // });

    // // Obtener datos del contrato desde la base de datos
    // const contractData = await Contract.findOne({
    //   where: { id: contractId },
    //   attributes: ["name"],
    // });
     // Obtener datos de usuario y contrato de forma paralela
     const [user, contractData] = await Promise.all([
      User.findOne({
        where: { id: userId },
        attributes: ["name", "dni", "lastname", "email"],
      }),
      Contract.findOne({
        where: { id: contractId },
        attributes: ["name"],
      })
    ]);

    // Reemplazar variables en el contrato HTML
    const processedContract = contract
      .replace(/{name}/g, user ? user.name : "")
      .replace(/{dni}/g, user ? user.dni : "");

    // Generar PDF a partir del contenido HTML del contrato con datos de usuario reemplazados
    const pdfPath = await generatePDF(processedContract);

    // Enviar el contrato por correo electrónico
    await sendUserContractEmail(user, pdfPath);

    // Guardar la ruta del PDF en la base de datos
    const newUserContract = await UserContract.create({
      userId,
      contractId,
      contract: processedContract,
      contract_signed,
      createdBy
    });

    return res.status(201).json({
      ok: true,
      newUserContract: {
        ...newUserContract.toJSON(),
        userId: user ? `${user.name} ${user.lastname}` : null,
        contractId: contractData ? contractData.name : null,
        contract: processedContract,
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
    const userContract = await UserContract.findOne({
      where: { id },
    });
    if (!userContract) {
      return res.status(404).json({
        ok: false,
        msg: "UserContract no encontrado",
      });
    }

    const { userId, contractId, contract, contract_signed } = req.body;

    const user = await User.findOne({
      where: { id: userId },
      attributes: ["name", "dni", "lastname", "email"],
    });

    const contractData = await Contract.findOne({
      where: { id: contractId },
      attributes: ["name"],
    });

    let processedContract = contract.replace(/{name}/g, user ? user.name : "");
    processedContract = processedContract.replace(
      /{dni}/g,
      user ? user.dni : ""
    );
    userContract.set({
      userId,
      contractId,
      contract: processedContract,
      contract_signed, // incluir el contract_signed recibido en la solicitud
    });
    const pdfPath = await generatePDF(processedContract);
    await sendUserContractEmailUpdate(user, pdfPath);
    await userContract.save();
    return res.status(200).json({
      ok: true,
      userContract: {
        ...userContract.toJSON(),
        userId: user ? user.name : null,
        contractId: contractData ? contractData.name : null,
        contract: processedContract,
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
    const userContract = await UserContract.findOne({ where: { id } });
    if (!userContract) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del contrato del usuario",
      });
    }

    const [row, [updateUserContract]] = await UserContract.update(
      { isActive: false },
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res.status(200).json({
        ok: true,
        userContract: { ...updateUserContract.dataValues },
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
