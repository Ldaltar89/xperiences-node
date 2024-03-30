const User = require("../models/User.js");
const sendMail = require("../config/email/emails.js");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (!users) {
      return res.status(401).json({
        ok: false,
        msg: "Error al listar usuarios",
      });
    }
    return res.status(200).json({ ok: true, users });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, lastname, dni, email, password } = req.body;
    if (!name || !lastname || !dni || !email || !password) {
      return res
        .status(400)
        .json({ ok: false, msg: "Faltan datos obligatorios." });
    }
    // Añadir el rol por defecto como "USER"
    req.body.rol = "USER";
    const newUser = await User.create(req.body);
    sendMail(newUser);
    return res
      .status(200)
      .json({ ok: true, newUser, msg: "Creado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id },
    });
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del usuario",
      });
    }
    return res.status(200).json({ ok: true, user });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      where: { id },
    });
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del usuario",
      });
    }
    // Si se proporcionó una nueva contraseña en la solicitud, encriptarla
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
      req.body.password = hashedPassword; // Actualizar la contraseña en el cuerpo de la solicitud
    }
    user.set(req.body);
    await user.save();
    return res.status(200).json({
      ok: true,
      user,
      msg: "Actualizado correctamente",
    });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const _user = await User.findOne({ where: { id } });
    if (!_user) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del usuario",
      });
    }

    const [row, [updateUser]] = await User.update(
      { isActive: false },
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res.status(200).json({
        ok: true,
        user: { ...updateUser.dataValues },
        msg: "Eliminado correctamente",
      });
    } else {
      return res
        .status(404)
        .json({ ok: false, msg: "No se pudo eliminar el usuario" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
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
        msg: "Error en el email del usuario",
      });
    }
    user.isActive = true;
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "Confirmado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
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
