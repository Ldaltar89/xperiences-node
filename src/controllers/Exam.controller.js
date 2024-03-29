const Exam = require("../models/Exam.js");

const getExams = async (req, res) => {
  try {
    const exam = await Exam.findAll();
    return res.status(200).json(exam);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createExam = async (req, res) => {
  const { name } = req.body;
  try {
    const newExam = await Exam.create({
      name,
    });
    return res.status(200).json({ msg: "Exam Creado", newExam });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getExam = async (req, res) => {
  const { id } = req.params;
  try {
    const exam = await Exam.findOne({
      where: { id },
    });
    return res.status(200).json({ ok: true, exam });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateExam = async (req, res) => {
  const { id } = req.params;
  try {
    const exam = await Exam.findOne({
      where: { id },
    });
    exam.set(req.body);
    await exam.save();
    return res.status(200).json({ ok: true, exam });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteExam = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Exam.update(
      { isActive: false },
      { where: { id } }
    );
    return res.status(200).json({ ok: "Exam deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExams,
  createExam,
  getExam,
  updateExam,
  deleteExam
};
