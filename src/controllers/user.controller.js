const User = require("../models/User.js");
const University = require("../models/University.js");
const Season = require("../models/Season.js");
const {sendMail} = require("../config/email/emailServices.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generarJWY = require("../helpers/jwt.js");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: University, as: "University", attributes: ["name"] },
        { model: Season, as: "Season", attributes: ["name"] },
      ],
      attributes: {
        exclude: ["universityId", "seasonId"],
      },
    });
    if (!users) {
      return res.status(401).json({
        ok: false,
        msg: "Error al listar usuarios",
      });
    }

    const modifiedUsers = users.map(user => {
      const { University, Season, ...rest } = user.toJSON();
      return {
        ...rest,
        universityId: University ? University.name : null,
        seasonId: Season ? Season.name : null,
      };
    });
  
    return res.status(200).json({ ok: true, users: modifiedUsers });
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
    const newUser = await User.create(req.body);
    const token = await generarJWY(
      newUser.id,
      "24h"
    );

    sendMail( newUser,token);
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

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
      req.body.password = hashedPassword;
    }
    user.set(req.body);
    await user.save();
    return res.status(200).json({
      ok: true,
      user,
      msg: "Actualizado correctamente",
    });
  } catch (error) {
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
  const { token } = req.params;
  try {
    const { id } = jwt.decode(
      token,
      process.env.SECRET_JWT_SEED
    );
    const user = await User.findOne({ where: { id } });
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

const getOlvidarPassword = async (req, res) => {

}

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserConfirmation,
};
