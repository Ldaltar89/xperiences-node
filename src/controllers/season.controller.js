const Season = require("../models/Season.js");

const getSeasons = async (req, res) => {
  try {
    const season = await Season.findAll();
    if (!season) {
      return res.status(401).json({
        ok: false,
        msg: "Error al listar temporadas",
      });
    }
    return res.status(200).json({ ok: true, season });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
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
    return res.status(500).json({ ok: false, msg: error.message });
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
        msg: "Error con el id de la temporada",
      });
    }
    return res.status(200).json({ ok: true, season });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
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
        msg: "Error con el id de la temporada",
      });
    }
    season.set(req.body);
    await season.save();
    return res
      .status(200)
      .json({ ok: true, season, msg: "Actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const deleteSeason = async (req, res) => {
  const { id } = req.params;
  try {
    const season = await Season.findOne({ where: { id } });
    if (!season) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id de la temporada",
      });
    }
    const [row, [updateSeason]] = await Season.update(
      { isActive: !season.isActive },
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res.status(200).json({
        ok: true,
        season: { ...updateSeason.dataValues },
        msg: !season.isActive
          ? "Universidad activada correctamente"
          : "Universidad inactivada correctamente",
      });
    } else {
      return res
        .status(404)
        .json({ ok: false, msg: "No se pudo eliminar la temporada" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = {
  createSeason,
  deleteSeason,
  getSeason,
  getSeasons,
  updateSeason,
};
