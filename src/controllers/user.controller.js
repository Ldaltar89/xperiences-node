const User = require("../models/User.js");
const sendMail = require("../config/email/emails.js");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (!users) {
      return res.status(401).json({
        ok: false,
        msg: "Error al Listar Users",
      });
    }
    return res.json({ ok: true, users });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Ocurrio un error al cargar el Listado de User",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    sendMail(newUser);
    return res.json({ ok: true, newUser, msg: "Creado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: "Error al crear User" });
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
        msg: "Error con el id del User",
      });
    }
    return res.status(200).json({ ok: true, user });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Ocurrio un error al cargar el User" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id },
    });
    if (!user) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del User",
      });
    }
    user.set(req.body);
    await user.save();
    return res.json({
      ok: true,
      user,
      msg: "Actualizado correctamente",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error al actualizar el User" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const _user = await User.findOne({ where: { id } });

    if (!_user) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del User",
      });
    }

    const [row, [updateUser]] = await User.update(
      { isActive: false },
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res
        .status(200)
        .json({
          ok: true,
          user: { ...updateUser.dataValues },
          msg: "Eliminado Correctamente",
        });
    } else {
      return res
        .status(404)
        .json({ ok: false, msg: "No se pudo eliminar el usuario" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error al Eliminar el User" });
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
        msg: "Error en el email del Usuario",
      });
    }
    user.isActive = true;
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "Confirmado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error al confirmar el email" });
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
