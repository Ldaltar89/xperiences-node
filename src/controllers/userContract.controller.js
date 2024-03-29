const UserContract = require("../models/UserContract.js");

const getUserContracts = async (req, res) => {
  try {
    const userContracts = await UserContract.findAll();
    if (!userContracts) {
      return res.status(401).json({
        ok: false,
        msg: "Error al Listar UserContracts",
      });
    }
    return res.status(200).json({ ok: true, userContracts });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Ocurrio un error al cargar el Listado de UserContracts",
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
      .json({ ok: false, msg: "Error al crear userContract" });
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
        msg: "Error con el id del UserContract",
      });
    }
    return res.status(200).json({ ok: true, userContract });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Ocurrio un error al cargar el UserContract" });
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
        msg: "Error con el id del UserContract",
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
      .json({ ok: false, msg: "Error al actualizar el userContract" });
  }
};

const deleteUserContract = async (req, res) => {
  const { id } = req.params;
  try {
    const userContract = await UserContract.findOne({ where: { id } });

    if (!userContract) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del UserContract",
      });
    }

    const result = await UserContract.update(
      { isActive: false },
      { where: { id } }
    );

    return res
      .status(200)
      .json({ ok: true, result, msg: "Eliminado Correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, msg: "Error al Eliminar el userContract" });
  }
};

module.exports = {
  getUserContracts,
  createUserContract,
  getUserContract,
  updateUserContract,
  deleteUserContract,
};
