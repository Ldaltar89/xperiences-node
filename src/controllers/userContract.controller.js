const UserContract = require("../models/UserContract.js");

const getUserContracts = async (req, res) => {
  try {
    const usercontracts = await UserContract.findAll();
    return res.status(200).json(usercontracts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createUserContract = async (req, res) => {
  const { contract, contract_signed } = req.body;
  try {
    const newUserContract = await UserContract.create({
      contract,
      contract_signed,
    });
    return res
      .status(200)
      .json({ msg: "UserContract Creado", newUserContract });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserContract = async (req, res) => {
  const { id } = req.params;
  try {
    const userContract = await UserContract.findOne({
      where: { id },
    });
    return res.status(200).json({ ok: true, userContract });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUserContract = async (req, res) => {
  const { id } = req.params;
  try {
    const userContract = await UserContract.findOne({
      where: { id },
    });
    userContract.set(req.body);
    await userContract.save();
    return res.status(200).json({ ok: true, userContract });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUserContract = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await UserContract.update(
      { isActive: false },
      { where: { id } }
    );
    return res.status(200).json({ ok: "UserContract deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserContracts,
  createUserContract,
  getUserContract,
  updateUserContract,
  deleteUserContract,
};
