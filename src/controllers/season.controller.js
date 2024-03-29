const Season = require("../models/Season.js");

const getSeasons = async (req, res) => {
  try {
    const season = await Season.findAll();
    if (!season) {
      return res.status(401).json({
        ok: false,
        msg: "Error al Listar Seasons",
      });
    }
    return res.status(200).json({ ok: true, season });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Ocurrio un error al cargar el Listado de Seasons",
    });
  }
};

const createSeason = async (req, res) => {
  try {
    const newSeason = await Season.create(req.body);
    return res
      .status(200)
      .json({ ok: true, newSeason, msg: "Creado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: "Error al crear Season" });
  }
};

const getSeason = async (req, res) => {
  const { id } = req.params;
  try {
    const season = await Season.findOne({
      where: { id },
    });
    if (!season) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del Season",
      });
    }
    return res.status(200).json({ ok: true, season });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Ocurrio un error al cargar el Season" });
  }
};

const updateSeason = async (req, res) => {
  const { id } = req.params;
  try {
    const season = await Season.findOne({
      where: { id },
    });
    if (!season) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del Season",
      });
    }
    season.set(req.body);
    await season.save();
    return res
      .status(200)
      .json({ ok: true, season, msg: "Actualizado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error al actualizar el Season" });
  }
};

const deleteSeason = async (req, res) => {
  const { id } = req.params;
  try {
    const season = await Season.findOne({ where: { id } });

    if (!season) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del Season",
      });
    }
    const result = await Season.update({ isActive: false }, { where: { id } });

    return res
      .status(200)
      .json({ ok: true, result, msg: "Eliminado Correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error al Eliminar el Season" });
  }
};

module.exports = {
  createSeason,
  deleteSeason,
  getSeason,
  getSeasons,
  updateSeason,
};
