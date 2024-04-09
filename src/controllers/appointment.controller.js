const { where } = require("sequelize");
const Appointment = require("../models/Appointment.js");
const User = require("../models/User.js");
const Schedule = require("../models/Schedule.js");

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, as: "User", attributes: ["name"] },
        { model: Schedule, as: "Schedule", attributes: ["Day"] },
      ],
      attributes: { exclude: ["userId", "scheduleId"] },
    });
    if (!appointments) {
      return res.status(401).json({
        ok: false,
        msg: "Error al listar Appointment",
      });
    }

    const modifiedAppointments = appointments.map((appointment) => {
      const { User, Schedule, ...rest } = appointment.toJSON();
      return {
        ...rest,
        userId: User ? User.name : null,
        scheduleId: Schedule ? Schedule.Day : null,
      };
    });
    return res
      .status(200)
      .json({ ok: true, appointments: modifiedAppointments });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { userId, scheduleId, ...appointmentData } = req.body;

    const user = await User.findOne({
      where: { id: userId },
      attributes: ["name"],
    });

    const schedule = await Schedule.findOne({
      where: { id: scheduleId },
      attributes: ["Day"],
    });

    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Error en el id del Usuario",
      });
    }

    if (!schedule) {
      return res.status(401).json({
        ok: false,
        msg: "Error en el id del Schedule",
      });
    }

    const newAppointment = await Appointment.create({
      userId,
      scheduleId,
      ...appointmentData,
    });
    return res.status(200).json({
      ok: true,
      newAppointment: {
        ...newAppointment.toJSON(),
        userId: user ? user.name : null,
        scheduleId: schedule ? schedule.Day : null,
      },
      msg: "Creado correctamente",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const getAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findOne({
      where: { id },
    });
    if (!appointment) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del Appointment",
      });
    }
    return res.status(200).json({ ok: true, schedule });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findOne({
      where: { id },
    });
    if (!appointment) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id de Appointment",
      });
    }
    appointment.set(req.body);
    await appointment.save();
    return res
      .status(200)
      .json({ ok: true, appointment, msg: "Actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findOne({ where: { id } });
    if (!appointment) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del Appointment",
      });
    }
    const [row, [updateAppointment]] = await Appointment.update(
      { isActive: false },
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res.status(200).json({
        ok: true,
        appointment: { ...updateAppointment.dataValues },
        msg: "Eliminado correctamente",
      });
    } else {
      return res
        .status(404)
        .json({ ok: false, msg: "No se pudo eliminar el appointment" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
};
