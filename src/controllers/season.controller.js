const Season = require("../models/Season.js");

const getSeasons = async (req, res) => {
  try {
    const season = await Season.findAll();
    return res.json(season);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createSeason = async (req, res) => {
  const { name, season_year } = req.body;
  try {
    const newSeason = await Season.create({
      name,
      season_year,
    });
    return res.json(newSeason);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSeason = async (req, res) => {
  const { id } = req.params;
  try {
    const season = await Season.findOne({
      where: { id },
    });
    return res.json(season);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateSeason = async (req, res) => {
  const { id } = req.params;
  try {
    const season = await Season.findOne({
      where: { id },
    });
    season.set(req.body);
    await season.save();
    return res.json(season);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSeason = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Season.update({ isActive: false }, { where: { id } });
    return res.status(200).json({ message: "Season deleted" });
  } catch (error) {
    return res.res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSeason,
  deleteSeason,
  getSeason,
  getSeasons,
  updateSeason,
};
