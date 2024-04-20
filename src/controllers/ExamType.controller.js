const ExamType = require("../models/ExamType.js");

const getExamTypes = async (req, res) => {
  try {
    const examType = await ExamType.findAll();
    if (!examType) {
      return res.status(401).json({
        ok: false,
        msg: "Error al listar ExamType",
      });
    }
    return res.status(200).json({ ok: true, examType });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createExamType = async (req, res) => {
  try {
    const newExamType = await ExamType.create(req.body);
    return res
      .status(200)
      .json({ ok: true, newExamType, msg: "Creado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getExamType = async (req, res) => {
  const { id } = req.params;
  try {
    const examType = await ExamType.findOne({
      where: { id },
    });
    if (!examType) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del ExamType",
      });
    }
    return res.status(200).json({ ok: true, examType });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const updateExamType = async (req, res) => {
  const { id } = req.params;
  try {
    const examType = await ExamType.findOne({
      where: { id },
    });
    if (!examType) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del ExamType",
      });
    }
    examType.set(req.body);
    await examType.save();
    return res
      .status(200)
      .json({ ok: true, examType, msg: "Actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteExamType = async (req, res) => {
  const { id } = req.params;
  try {
    const examType = await ExamType.findOne({ where: { id } });
    if (!examType) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del ExamType",
      });
    }
    const [row, [updateExamType]] = await ExamType.update(
      { isActive: !examType.isActive},
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res.status(200).json({
        ok: true,
        examType: { ...updateExamType.dataValues },
        msg: !examType.isActive
        ? "Tipo de Examen activado correctamente"
        : "Tipo de Examen inactivado correctamente",
      });
    } else {
      return res
        .status(404)
        .json({ ok: false, msg: "No se pudo eliminar el Typo de Examen" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = {
  getExamTypes,
  createExamType,
  getExamType,
  updateExamType,
  deleteExamType,
};
