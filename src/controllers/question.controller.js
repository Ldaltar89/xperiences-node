const Question = require("../models/Question.js");

const getQuestions = async (req, res) => {
  try {
    const question = await Question.findAll();
    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createQuestion = async (req, res) => {
  const { question, question_type } = req.body;
  try {
    const newQuestion = await Question.create({
      question,
      question_type,
    });
    return res.status(200).json({ msg: "Question Creado", newQuestion });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findOne({
      where: { id },
    });
    return res.status(200).json({ ok: true, question });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findOne({
      where: { id },
    });
    question.set(req.body);
    await question.save();
    return res.status(200).json({ ok: true, question });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Question.update({ isActive: false }, { where: { id } });
    return res.status(200).json({ ok: "Question deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
    getQuestions,
    createQuestion,
    getQuestion,
    updateQuestion,
    deleteQuestion
};
