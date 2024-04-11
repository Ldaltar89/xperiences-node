const Payment = require("../models/Payment.js");
const User = require("../models/User.js");

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
        include: [{ model: User, as: "User", attributes: ["name", "lastname"] }],
        attributes: { exclude: ["userId"] },
      });
    } else {
      payments = await Payment.findAll({
        where: { userId: id },
        include: [{ model: User, as: "User", attributes: ["name", "lastname"] }],
        attributes: { exclude: ["userId"] },
      });
    }
    // if (!payments || payments.length === 0) {
    //   return res
    //     .status(404)
    //     .json({ ok: false, msg: "No se encontraron payments" });
    // }
    const modifiedPayments = payments.map((payment) => {
      const {User, ...rest } = payment.toJSON();
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
    const payment = await Payment.findOne({ where: { id } });
    if (!payment) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del pago",
      });
    }
    const [row, [updatePayment]] = await Payment.update(
      { isActive: false },
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res.status(200).json({
        ok: true,
        payment: { ...updatePayment.dataValues },
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
