const University = require("../models/University.js");

const getUniversities = async (req, res) => {
  try {
    const universities = await University.findAll();
    return res.json(universities);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createUniversity = async (req, res) => {
  const { name, type } = req.body;
  try {
    const newUniversity = await University.create({
      name,
      type,
    });
    return res.json({ msg: "Universidad Creada", newUniversity });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUniversity = async (req, res) => {
  const { id } = req.params;
  try {
    const university = await University.findOne({
      where: { id },
    });
    return res.json(university);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUniversity = async (req, res) => {
  const { id } = req.params;
  try {
    const university = await University.findOne({
      where: { id },
    });
    university.set(req.body);
    await university.save();
    return res.json(university);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUniversity = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await University.update(
      { isActive: false },
      { where: { id } }
    );
    return res.status(200).json({ messaje: "University deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUniversities,
  createUniversity,
  getUniversity,
  updateUniversity,
  deleteUniversity,
};
