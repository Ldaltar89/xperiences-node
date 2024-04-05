const UserExam = require("../models/UserExam.js");
const Exam = require("../models/Exam.js");
const User = require("../models/User.js");

const getUserExams = async (req, res) => {
  try {
    const userExams = await UserExam.findAll({
      include: [
        { model: Exam, as: "Exam", attributes: ["name"] },
        { model: User, as: "User", attributes: ["name"] },
      ],
      attributes: { exclude: ["examId", "userId"] },
    });
    if (!userExams) {
      return res.status(401).json({
        ok: false,
        msg: "Error al listar el User Examenes",
      });
    }

    const modifiedUserExams = userExams.map((userExam) => {
      const { Exam, User, ...rest } = userExam.toJSON();
      return {
        ...rest,
        examId: Exam ? Exam.name : null,
        userId: User ? User.name : null,
      };
    });
    return res.status(200).json({ ok: true, userExams: modifiedUserExams });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

const createUserExam = async (req, res) => {
  try {
    const newUserExam = await UserExam.create(req.body);
    return res
      .status(200)
      .json({ ok: true, newUserExam, msg: "Creado correctamente" });
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
