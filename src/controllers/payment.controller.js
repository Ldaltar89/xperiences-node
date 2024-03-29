const Payment = require("../models/Payment.js");

const getPayments = async (req, res) => {
  try {
    const payment = await Payment.findAll();
    return res.status(200).json(payment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const newPayment = await Payment.create(req.body);
    return res.status(200).json({ msg: "Payment Realizado", newPayment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPayment = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findOne({
      where: { id },
    });
    return res.status(200).json({ payment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePayment = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findOne({
      where: { id },
    });
    payment.set(req.body);
    await payment.save();
    return res.status(200).json({ msg: "Payment Actualizado", payment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletedPayment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Payment.update({ isActive: false }, { where: { id } });
    return res.status(200).json({ msg: "Payment Eliminado" });
  } catch (error) {
    return res.res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayments,
  createPayment,
  getPayment,
  updatePayment,
  deletedPayment,
};
