const Schedule = require("../models/Schedule.js");

const getShedules = async (req, res) => {
  try {
    const schedule = await Schedule.findAll();
    if (!schedule) {
      return res.status(401).json({
        ok: false,
        msg: "Error al listar horarios",
      });
    }
    return res.status(200).json({ ok: true, schedule });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

const createSchedule = async (req, res) => {
  try {
    const newSchedule = await Schedule.create(req.body);
    return res
      .status(200)
      .json({ ok: true, newSchedule, msg: "Creado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const getSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const schedule = await Schedule.findOne({
      where: { id },
    });
    if (!schedule) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del horario",
      });
    }
    return res.status(200).json({ ok: true, schedule });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const updateSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const schedule = await Schedule.findOne({
      where: { id },
    });
    if (!schedule) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id de la horario",
      });
    }
    schedule.set(req.body);
    await schedule.save();
    return res
      .status(200)
      .json({ ok: true, schedule, msg: "Actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    const schedule = await Schedule.findOne({ where: { id } });
    if (!schedule) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id de la horario",
      });
    }
    const [row, [updateSchedule]] = await Schedule.update(
      { isActive: false },
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res.status(200).json({
        ok: true,
        schedule: { ...updateSchedule.dataValues },
        msg: "Eliminado correctamente",
      });
    } else {
      return res
        .status(404)
        .json({ ok: false, msg: "No se pudo eliminar el horario" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = {
  getShedules,
  createSchedule,
  getSchedule,
  updateSchedule,
  deleteSchedule,
};
