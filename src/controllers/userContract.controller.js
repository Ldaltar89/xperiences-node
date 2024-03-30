const UserContract = require("../models/UserContract.js");
const User = require("../models/User.js");
const Contract = require("../models/Contract.js");
const Season = require("../models/Season.js");
const University = require("../models/University.js");

const getUserContracts = async (req, res) => {
  try {
    const userContracts = await UserContract.findAll({
      include: [
        { model: User, as: "User", attributes: ["name"] },
        { model: Contract, as: "Contract", attributes: ["name"] },
        { model: Season, as: "Season", attributes: ["name"] },
      ],
      attributes: { exclude: ["userId", "contractId", "seasonId"] },
    });
    if (!userContracts) {
      return res.status(401).json({
        ok: false,
        msg: "Error al listar contratos de usuario",
      });
    }

    const modifiedUserContracts = userContracts.map((userContract) => {
      const { User, Contract, Season, ...rest } = userContract.toJSON();
      return {
        ...rest,
        userId: User ? User.name : null,
        contractId: Contract ? Contract.name : null,
        seasonId: Season ? Season.name : null,
      };
    });
    return res
      .status(200)
      .json({ ok: true, userContracts: modifiedUserContracts });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
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
    return res.status(500).json({ ok: false, msg: error.message });
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
        msg: error.message,
      });
    }
    return res.status(200).json({ ok: true, userContract });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
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
        msg: error.message,
      });
    }
    userContract.set(req.body);
    await userContract.save();
    return res
      .status(200)
      .json({ ok: true, userContract, msg: "Actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
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
      return res.status(200).json({
        ok: true,
        userContract: { ...updateUserContract.dataValues },
        msg: "Eliminado Correctamente",
      });
    } else {
      return res.status(404).json({
        ok: false,
        msg: "No se pudo eliminar el contrato del usuario",
      });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = {
  getUserContracts,
  createUserContract,
  getUserContract,
  updateUserContract,
  deleteUserContract,
};
