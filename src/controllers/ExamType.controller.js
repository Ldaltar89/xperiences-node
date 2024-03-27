const ExamType = require("../models/ExamType.js");

const getExamTypes = async (req, res) => {
  try {
    const examType = await ExamType.findAll();
    return res.status(200).json({ examType });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createExamType = async (req, res) => {
  const { name } = req.body;
  try {
    const newExamType = await ExamType.create({
      name,
    });
    return res.status(200).json({ msg: "ExamType Creado", newExamType });
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
    return res.status(200).json({ ok: true, examType });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateExamType = async (req, res) => {
  const { id } = req.params;
  try {
    const examType = await ExamType.findOne({
      where: { id },
    });
    examType.set(req.body);
    await examType.save();
    return res.status(200).json({ ok: true, examType });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteExamType = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ExamType.update(
      { isActive: false },
      { where: { id } }
    );
    return res.status(200).json({ ok: "ExamType deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExamTypes,
  createExamType,
  getExamType,
  updateExamType,
  deleteExamType,
};
