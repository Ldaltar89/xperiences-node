const University = require("../models/University.js");

const getUniversities = async (req, res) => {
  try {
    const university = await University.findAll();
    if (!university) {
      return res.status(401).json({
        ok: false,
        msg: "Error al Listar Universidades",
      });
    }
    return res.status(200).json({ ok: true, university });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Ocurrio un error al cargar el Listado de Universidad",
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
      .json({ ok: false, msg: "Error al crear Universidad" });
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
        msg: "Error con el id de Universidad",
      });
    }
    return res.status(200).json({ ok: true, university });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Ocurrio un error al cargar la Universidad" });
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
        msg: "Error con el id del Universidad",
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
      .json({ ok: false, msg: "Error al actualizar el Universidad" });
  }
};

const deleteUniversity = async (req, res) => {
  const { id } = req.params;
  try {
    const university = await University.findOne({ where: { id } });

    if (!university) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id de la Universidad",
      });
    }
    const result = await University.update(
      { isActive: false },
      { where: { id } }
    );
    return res
      .status(200)
      .json({ ok: true, result, msg: "Eliminado Correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error al Eliminar el Universidad" });
  }
};

module.exports = {
  getUniversities,
  createUniversity,
  getUniversity,
  updateUniversity,
  deleteUniversity,
};
