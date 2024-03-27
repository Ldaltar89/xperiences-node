const Contract = require("../models/Contract.js");

const getContracts = async (req, res) => {
  try {
    const contract = await Contract.findAll();
    return res.status(200).json({ contract });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createContract = async (req, res) => {
  const { name, contract, seasonId } = req.body;
  try {
    const newContract = await Contract.create({
      name,
      contract,
      seasonId,
    });
    return res.status(200).json({ msg: "Contrato Creado", newContract });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getContract = async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await Contract.findOne({
      where: { id },
    });
    return res.status(200).json({ ok: true, contract });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateContract = async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await Contract.findOne({
      where: { id },
    });
    contract.set(req.body);
    await contract.save();
    return res.status(200).json({ ok: true, contract });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteContract = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Contract.update(
      { isActive: false },
      { where: { id } }
    );
    return res.status(200).json({ ok: "Contract deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getContracts,
  createContract,
  getContract,
  updateContract,
  deleteContract,
};
