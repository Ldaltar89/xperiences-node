const UserExam = require("../models/UserExam.js");
const Exam = require("../models/Exam.js");
const User = require("../models/User.js");
const { where, Op } = require("sequelize");

const getUserExams = async (req, res) => {
  const id = req.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }
    let userExams;
    if (user.rol === "Administrador") {
      userExams = await UserExam.findAll({
        include: [
          { model: Exam, as: "Exam", attributes: ["name"] },
          { model: User, as: "User", attributes: ["name", "lastname"] },
        ],
        attributes: { exclude: ["examId", "userId"] },
      });
    } else {
      userExams = await UserExam.findAll({
        where: { userId: id },
        include: [
          { model: Exam, as: "Exam", attributes: ["name"] },
          { model: User, as: "User", attributes: ["name", "lastname"] },
        ],
        attributes: { exclude: ["examId", "userId"] },
      });
    }

    // if (!userExams || userExams.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ ok: false, msg: "No se encontraron User Exams" });
    // }

    const modifiedUserExams = userExams.map((userExam) => {
      const { Exam, User, ...rest } = userExam.toJSON();
      return {
        ...rest,
        examId: Exam ? `${Exam.name}` : null,
        userId: User ? `${User.name} ${User.lastname}` : null,
      };
    });

    return res.status(200).json({ ok: true, userExams: modifiedUserExams });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }

  //------------------------------------------------------------------------------
  // const id = req.id;
  // try {
  //   const user = await User.findByPk(id);
  //   if (!user) {
  //     return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
  //   }

  //   let userExams;
  //   if (user.rol === "Administrador") {
  //     userExams = await UserExam.findAll({
  //       include: [
  //         { model: Exam, as: "Exam", attributes: ["name"] },
  //         { model: User, as: "User", attributes: ["name", "lastname"] },
  //       ],
  //       attributes: { exclude: ["examId", "userId"] },
  //     });
  //   } else {
  //     userExams = await UserExam.findAll({
  //       where: { userId: id },
  //       include: [
  //         { model: Exam, as: "Exam", attributes: ["name"] },
  //         { model: User, as: "User", attributes: ["name", "lastname"] },
  //       ],
  //       attributes: { exclude: ["examId", "userId"] },
  //     });
  //   }

  //   // Obtener los ids de los usuarios creadores y actualizadores
  //   const createdByIds = userExams.map((userExam) => userExam.createdBy);
  //   const updatedByIds = userExams.map((userExam) => userExam.updatedBy);

  //   // Consultar los nombres y apellidos de los usuarios creadores y actualizadores
  //   const createdByUsers = await User.findAll({
  //     where: { id: createdByIds },
  //     attributes: ["id", "name", "lastname"],
  //   });
  //   const updatedByUsers = await User.findAll({
  //     where: { id: updatedByIds },
  //     attributes: ["id", "name", "lastname"],
  //   });

  //   // Mapear los nombres y apellidos de los usuarios creadores y actualizadores a cada UserExam
  //   const modifiedUserExams = userExams.map((userExam) => {
  //     const createdByUser = createdByUsers.find(
  //       (user) => user.id === userExam.createdBy
  //     );
  //     const updatedByUser = updatedByUsers.find(
  //       (user) => user.id === userExam.updatedBy
  //     );
  //     const { Exam, User, ...rest } = userExam.toJSON();

  //     return {
  //       ...rest,
  //       createdBy: createdByUser
  //         ? `${createdByUser.name} ${createdByUser.lastname}`
  //         : null,
  //       updatedBy: updatedByUser
  //         ? `${updatedByUser.name} ${updatedByUser.lastname}`
  //         : null,
  //       examId: Exam ? Exam.name : null,
  //       userId: User ? `${User.name} ${User.lastname}` : null,
  //     };
  //   });

  //   return res.status(200).json({ ok: true, userExams: modifiedUserExams });
  // } catch (error) {
  //   return res.status(500).json({ ok: false, msg: error.message });
  // }
};

const createUserExam = async (req, res) => {
  try {
    const { userId, examId, createdBy, score, idDone } = req.body;

    // Buscar el nombre del usuario que está creando el examen
    // const createdByUser = await User.findByPk(createdBy, {
    //   attributes: ["name", "lastname"],
    // });

    // Buscar el usuario que está realizando el examen
    const user = await User.findByPk(userId, {
      attributes: ["name", "lastname"],
    });

    // Buscar el examen
    const exam = await Exam.findByPk(examId, {
      attributes: ["name"],
    });

    const newUserExam = await UserExam.create({
      userId,
      examId,
      createdBy,
      score,
      idDone,
    });

    return res.status(200).json({
      ok: true,
      newUserExam: {
        ...newUserExam.toJSON(),
        userId: user ? `${user.name} ${user.lastname}` : null,
        // createdBy: createdByUser
        //   ? `${createdByUser.name} ${createdByUser.lastname}`
        //   : "null",
        examId: exam ? exam.name : null,
      },
      msg: "Creado correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

const getUserExam = async (req, res) => {
  const { id } = req.params;
  try {
    const userExam = await UserExam.findOne({
      where: { id },
    });
    if (!userExam) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del User Examen",
      });
    }
    return res.status(200).json({ ok: true, userExam });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const updateUserExam = async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    examId,
    ...rest
  } = req.body;

  try {
    // Obtener el registro de UserExam
    const userExam = await UserExam.findOne({ where: { id } });

    if (!userExam) {
      return res
        .status(401)
        .json({ ok: false, msg: "Error con el id del User Examen" });
    }

    // Obtener el usuario que creó el examen
    // const createdByUser = await User.findByPk(userExam.createdBy, {
    //   attributes: ["name", "lastname"],
    // });

    // Obtener el usuario que actualizó el examen
    // const updatedByUser = await User.findByPk(updatedBy, {
    //   attributes: ["name", "lastname"],
    // });
    // if (!updatedByUser) {
    //   return res
    //     .status(500)
    //     .json({ ok: false, msg: "Usuario que actualizo no existe" });
    // }

    // Obtener el usuario que realizó el examen
    const user = await User.findByPk(userId, {
      attributes: ["name", "lastname"],
    });

    // Obtener el examen
    const exam = await Exam.findByPk(examId, { attributes: ["name"] });

    // Actualizar el registro
    await userExam.update({
      userId,
      examId,
      ...rest
    });

    return res.status(200).json({
      ok: true,
      userExam: {
        ...userExam.toJSON(),
        userId: user ? `${user.name} ${user.lastname}` : null,
        // createdBy: createdByUser
        //   ? `${createdByUser.name} ${createdByUser.lastname}`
        //   : "null",
        // updatedBy: updatedByUser
        //   ? `${updatedByUser.name} ${updatedByUser.lastname}`
        //   : "null",
        examId: exam ? exam.name : null,
      },
      msg: "Actualizado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const deleteUserExam = async (req, res) => {
  const { id } = req.params;
  try {
    const userExam = await UserExam.findOne({ where: { id } });
    if (!userExam) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del User Examen",
      });
    }
    const [row, [updateUserExam]] = await UserExam.update(
      { isActive: false },
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res.status(200).json({
        ok: true,
        userExam: { ...updateUserExam.dataValues },
        msg: "Eliminado correctamente",
      });
    } else {
      return res
        .status(404)
        .json({ ok: false, msg: "No se pudo eliminar el User Examen" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};
module.exports = {
  getUserExams,
  createUserExam,
  getUserExam,
  updateUserExam,
  deleteUserExam,
};
