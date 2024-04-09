const User = require("../models/User.js");
const generarJWY = require("../helpers/jwt.js");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../config/email/emailServices.js");
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
require("dotenv").config();

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe o la cuenta no está activa",
      });
    }
    const verificarPass = await user.validarPassword(password);
    if (!verificarPass)
      return res.status(400).json({
        msg: "Password Incorrecto",
      });

    //Generar nuestro JWT
    const token = await generarJWY(user.id, "24h");

    return res.json({
      ok: true,
      msg: "Usuario Logueado",
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      rol: user.rol,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const revalidateToken = async (req, res) => {
  try {
    const id = req.id;
    //Generar el Token
    const token = await generarJWY(id, "24h");
    //obtener el usuario por UID
    const user = await User.findOne({ where: { id } });

    return res.status(200).json({
      ok: true,
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error en el email y contraseña",
    });
  }
};

//Confirmar cuenta
const getUserConfirmation = async (req, res) => {
  const { token } = req.params;
  try {
    const { id } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Error en el token del usuario",
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

const postVerificationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(401).json({
        ok: false,
        msg: "El email es necesario",
      });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "El email no es valido",
      });
    }
    const token = await generarJWY(user.id, "10m");
    sendVerificationEmail(user, token);
    return res.status(200).json({ ok: true, msg: "Mensaje enviado", token });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const getTokenVerification = async (req, res) => {
  const { token } = req.params;
  try {
    const { id } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }
    return res.status(200).json({
      ok: true,
      msg: "Token Valido",
      id,
      token,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const postResetPassword = async (req, res) => {
  const { password, id } = req.body;

  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }
    if (!password) {
      return res.status(401).json({
        ok: false,
        msg: "Se requiere una contraseña",
      });
    }
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      ok: true,
      msg: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = {
  loginUser,
  revalidateToken,
  getUserConfirmation,
  postVerificationEmail,
  getTokenVerification,
  postResetPassword,
};
