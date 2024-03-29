const User = require("../models/User.js");
const sendMail = require("../config/email/emails.js");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const { name, lastname, dni, email, password } = req.body;
  try {
    const newUser = await User.create({
      name,
      lastname,
      dni,
      email,
      password,
    });
    sendMail(newUser);

    return res.json({ ok: true, newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id },
    });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id },
    });
    user.set(req.body);
    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.update({ isActive: false }, { where: { id } });
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Confirmar cuenta
const getUserConfirmation = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Error email del Usuario",
      });
    }
    user.isActive = true;
    await user.save();
    return res.status(200).json({ message: "Email confirmado" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserConfirmation,

};
