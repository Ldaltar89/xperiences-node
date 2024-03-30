const UserContract = require("../models/UserContract.js");

const getUserContracts = async (req, res) => {
  try {
    const userContracts = await UserContract.findAll();
    if (!userContracts) {
      return res.status(401).json({
        ok: false,
        msg: "Error al listar contratos de usuario",
      });
    }
    return res.status(200).json({ ok: true, userContracts });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message
    });
  }
};

const createUserContract = async (req, res) => {
  try {
    const newUserContract = await UserContract.create(req.body);
    return res
      .status(200)
      .json({ ok: true, newUserContract, msg: "Creado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: error.message });
  }
};

const getUserContract = async (req, res) => {
  const { id } = req.params;
  try {
    const userContract = await UserContract.findOne({
      where: { id },
    });
    if (!userContract) {
      return res.status(401).json({
        ok: false,
        msg: error.message
      });
    }
    return res.status(200).json({ ok: true, userContract });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: error.message });
  }
};

const updateUserContract = async (req, res) => {
  const { id } = req.params;
  try {
    const userContract = await UserContract.findOne({
      where: { id },
    });
    if (!userContract) {
      return res.status(401).json({
        ok: false,
        msg: error.message
      });
    }
    userContract.set(req.body);
    await userContract.save();
    return res
      .status(200)
      .json({ ok: true, userContract, msg: "Actualizado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: error.message });
  }
};

const deleteUserContract = async (req, res) => {
  const { id } = req.params;
  try {
    const userContract = await UserContract.findOne({ where: { id } });
    if (!userContract) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del contrato del usuario",
      });
    }

    const [row, [updateUserContract]] = await UserContract.update(
      { isActive: false },
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res
        .status(200)
        .json({
          ok: true,
          userContract: { ...updateUserContract.dataValues },
          msg: "Eliminado Correctamente",
        });
    } else {
      return res
        .status(404)
        .json({ ok: false, msg: "No se pudo eliminar el contrato del usuario" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: error.message });
  }
};

module.exports = {
  getUserContracts,
  createUserContract,
  getUserContract,
  updateUserContract,
  deleteUserContract,
};
