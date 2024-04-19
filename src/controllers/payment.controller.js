const Payment = require("../models/Payment.js");
const User = require("../models/User.js");
const Sequelize = require("sequelize");

const getPayments = async (req, res) => {
  const id = req.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }
    let payments;
    if (user.rol === "Administrador") {
      payments = await Payment.findAll({
        include: [
          { model: User, as: "User", attributes: ["name", "lastname"] },
        ],
        attributes: { exclude: ["userId"] },
        order: [["createdAt", "ASC"]],
      });
    } else {
      payments = await Payment.findAll({
        where: { userId: id },
        include: [
          { model: User, as: "User", attributes: ["name", "lastname"] },
        ],
        attributes: { exclude: ["userId"] },
        order: [["createdAt", "ASC"]],
      });
    }
    const modifiedPayments = payments.map((payment) => {
      const { User, ...rest } = payment.toJSON();
      return {
        ...rest,
        userId: User ? `${User.name} ${User.lastname}` : null,
      };
    });
    return res.status(200).json({ ok: true, payments: modifiedPayments });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const newPayment = await Payment.create(req.body);
    return res
      .status(200)
      .json({ ok: true, newPayment, msg: "Creado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const getPayment = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findOne({
      where: { id },
    });
    if (!payment) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del pago",
      });
    }
    return res.status(200).json({ ok: true, payment });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const updatePayment = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findOne({
      where: { id },
    });
    if (!payment) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del pago",
      });
    }

    if (req.body.isRejected || req.body.isCancelled) {
      payment.reference = "null";
    }

    if (req.body.isApproved) {
      payment.isRejected = false;
      payment.isCancelled = false;
    } else if (req.body.isRejected) {
      payment.isApproved = false;
      payment.isCancelled = false;
    } else if (req.body.isCancelled) {
      payment.isApproved = false;
      payment.isRejected = false;
    }

    payment.set(req.body);
    await payment.save();
    return res
      .status(200)
      .json({ ok: true, payment, msg: "Actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const deletedPayment = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findOne({
      where: { id },
      include: [{ model: User, as: "User", attributes: ["name", "lastname"] }],
      attributes: { exclude: ["userId"] },
    });
    if (!payment) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del pago",
      });
    }
    const [row] = await Payment.update({ isActive: false }, { where: { id } });
    if (row > 0) {
      const { User, ...rest } = payment.toJSON();
      const userId = User ? `${User.name} ${User.lastname}` : null;

      return res.status(200).json({
        ok: true,
        payment: { ...rest, userId },
        msg: "Eliminado correctamente",
      });
    } else {
      return res
        .status(404)
        .json({ ok: false, msg: "No se pudo eliminar el pago" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = {
  getPayments,
  createPayment,
  getPayment,
  updatePayment,
  deletedPayment,
};
