const UserExam = require("../models/UserExam.js");
const Exam = require("../models/Exam.js");
const User = require("../models/User.js");
const { where } = require("sequelize");

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

    if (!userExams || userExams.length === 0) {
      return res
        .status(404)
        .json({ ok: false, msg: "No se encontraron User Exams" });
    }

    const modifiedUserExams = userExams.map((userExam) => {
      const { Exam, User, ...rest } = userExam.toJSON();
      return {
        ...rest,
        examId: Exam ? Exam.name : null,
        userId: User ? `${User.name} ${User.lastname}` : null,
      };
    });

    return res.status(200).json({ ok: true, userExams: modifiedUserExams });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const createUserExam = async (req, res) => {
  try {
    const { userId, examId, ...userExamData } = req.body;

    const user = await User.findOne({
      where: { id: userId },
      attributes: ["name", "lastname"],
    });

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Error en el id del User",
      });
    }

    const exam = await Exam.findOne({
      where: { id: examId },
      attributes: ["name"],
    });

    if (!exam) {
      return res.status(401).json({
        ok: false,
        msg: "Error en el id del Exam",
      });
    }

    const newUserExam = await UserExam.create({
      userId,
      examId,
      ...userExamData,
    });
    return res.status(200).json({
      ok: true,
      newUserExam: {
        ...newUserExam.toJSON(),
        userId: user ? `${user.name} ${user.lastname}` : null,
        examId: exam ? exam.name : null,
      },
      msg: "Creado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
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
    userExam.set(req.body);
    await userExam.save();
    return res
      .status(200)
      .json({ ok: true, userExam, msg: "Actualizado correctamente" });
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
