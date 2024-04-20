const University = require("../models/University.js");

const getUniversities = async (req, res) => {
  try {
    const university = await University.findAll();
    if (!university) {
      return res.status(401).json({
        ok: false,
        msg: "Error al listar universidades",
      });
    }
    return res.status(200).json({ ok: true, university });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

const createUniversity = async (req, res) => {
  try {
    const newUniversity = await University.create(req.body);
    return res
      .status(200)
      .json({ ok: true, newUniversity, msg: "Creado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: error.message });
  }
};

const getUniversity = async (req, res) => {
  const { id } = req.params;
  try {
    const university = await University.findOne({
      where: { id },
    });
    if (!university) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id de la universidad",
      });
    }
    return res.status(200).json({ ok: true, university });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: error.message});
  }
};

const updateUniversity = async (req, res) => {
  const { id } = req.params;
  try {
    const university = await University.findOne({
      where: { id },
    });
    if (!university) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id de la universidad",
      });
    }
    university.set(req.body);
    await university.save();
    return res
      .status(200)
      .json({ ok: true, university, msg: "Actualizado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: error.message });
  }
};

const deleteUniversity = async (req, res) => {
  const { id } = req.params;
  try {
    const university = await University.findOne({ where: { id } });
    if (!university) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id de la universidad",
      });
    }
  const [row, [updateUniversity]] = await University.update(
      { isActive: !university.isActive },
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res
        .status(200)
        .json({
          ok: true,
          university: { ...updateUniversity.dataValues },
          msg: !university.isActive
          ? "Universidad activada correctamente"
          : "Universidad inactivada correctamente",
        });
    } else {
      return res
        .status(404)
        .json({ ok: false, msg: "No se pudo eliminar la universidad" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: error.message });
  }
};

module.exports = {
  getUniversities,
  createUniversity,
  getUniversity,
  updateUniversity,
  deleteUniversity,
};
