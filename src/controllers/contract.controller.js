const Contract = require("../models/Contract.js");
const Season = require("../models/Season.js");

const getContracts = async (req, res) => {
  try {
    const contracts = await Contract.findAll();
    if (!contracts) {
      return res.status(401).json({
        ok: false,
        msg: "Error al listar contratos",
      });
    }
    return res.status(200).json({ ok: true, contracts });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: error.message,
    });
  }
};

const createContract = async (req, res) => {
  try {
    const newContract = await Contract.create(req.body);
    return res
      .status(200)
      .json({ ok: true, newContract, msg: "Creado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const getContract = async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await Contract.findOne({
      where: { id },
    });
    if (!contract) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del contrato",
      });
    }
    return res.status(200).json({ ok: true, contract });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const updateContract = async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await Contract.findOne({
      where: { id },
    });
    if (!contract) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del contrato",
      });
    }
    contract.set(req.body);
    await contract.save();
    return res
      .status(200)
      .json({ ok: true, contract, msg: "Actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

const deleteContract = async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await Contract.findOne({ where: { id } });
    if (!contract) {
      return res.status(401).json({
        ok: false,
        msg: "Error con el id del contrato",
      });
    }
    const [row, [updateContract]] = await Contract.update(
      { isActive: !contract.isActive },
      { where: { id }, returning: true }
    );
    if (row > 0) {
      return res.status(200).json({
        ok: true,
        contract: { ...updateContract.dataValues },
        msg: !contract.isActive
        ? "Contrato activado correctamente"
        : "Contrato inactivado correctamente",
      });
    } else {
      return res
        .status(404)
        .json({ ok: false, msg: "No se pudo eliminar el contrato" });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = {
  getContracts,
  createContract,
  getContract,
  updateContract,
  deleteContract,
};
