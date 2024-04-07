const { where } = require("sequelize");
const Exam = require("../models/Exam.js");
const ExamType = require("../models/ExamType.js");

const getExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({
      include: [{ model: ExamType, as: "ExamType", attributes: ["name"] }],
      attributes: { exclude: ["examTypeId"] },
    });
    if (!exams) {
      return res.status(401).json({
        ok: false,
        msg: "Error al listar Examenes",
      });
    }

    const modifiedExams = exams.map((exam) => {
      const { ExamType, ...rest } = exam.toJSON();
      return {
        ...rest,
        examTypeId: ExamType ? ExamType.name : null,
      };
    });
    return res.status(200).json({ ok: true, exams: modifiedExams });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

const createExam = async (req, res) => {
  try {
    const { examTypeId, ...examData } = req.body;

    const examType = await ExamType.findOne({
      where: { id: examTypeId },
      attributes: ["name"],
    });

    if (!examType) {
      return res
        .status(401)
        .json({ ok: false, msg: "Error en el id del examType" });
    }

    const newExam = await Exam.create({
      examTypeId,
      ...examData,
    });
    return res.status(200).json({
      ok: true,
      newExam: {
        ...newExam.toJSON(),
        examTypeId: examType ? examType.name : null,
      },
      msg: "Creado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const getExam = async (req, res) => {
  const { id } = req.params;
  try {
    const exam = await Exam.findOne({
      where: { id },
    });
    if (!exam) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del Examen",
      });
    }
    return res.status(200).json({ ok: true, exam });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const updateExam = async (req, res) => {
  const { id } = req.params;
  try {
    const exam = await Exam.findOne({
      where: { id },
    });
    if (!exam) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del Examen",
      });
    }
    exam.set(req.body);
    await exam.save();
    return res
      .status(200)
      .json({ ok: true, exam, msg: "Actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const deleteExam = async (req, res) => {
  const { id } = req.params;
  try {
    //     const result = await Exam.update({ isActive: false }, { where: { id } });
    //     return res.status(200).json({ ok: "Exam deleted" });
    //   } catch (error) {
    //     return res.status(500).json({ message: error.message });
    //   }
    // };
    const exam = await Exam.findOne({ where: { id } });
    if (!exam) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del Examen",
      });
    }
    const [row, [updateExam]] = await Exam.update(
      { isActive: false },
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res.status(200).json({
        ok: true,
        exam: { ...updateExam.dataValues },
        msg: "Eliminado correctamente",
      });
    } else {
      return res
        .status(404)
        .json({ ok: false, msg: "No se pudo eliminar el Examen" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};
module.exports = {
  getExams,
  createExam,
  getExam,
  updateExam,
  deleteExam,
};
