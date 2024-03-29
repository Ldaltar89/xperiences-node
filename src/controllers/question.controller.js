const Question = require("../models/Question.js");

const getQuestions = async (req, res) => {
  try {
    const question = await Question.findAll();
    if (!question) {
      return res.status(401).json({
        ok: false,
        msg: "Error al Listar Questions",
      });
    }
    return res.status(200).json({ ok: true, question });
  } catch (error) {
    return res.status(500).json({ ok: false,
      msg: "Ocurrio un error al cargar el Listado de Questions", });
  }
};

const createQuestion = async (req, res) => {
  try {
    const newQuestion = await Question.create(req.body);
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
