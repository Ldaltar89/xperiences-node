const { DataTypes } = require("sequelize");
const Sequelize = require("../database/database.js");
const User = require("./User.js");
const Contract = require("./Contract.js");

const UserContract = Sequelize.define("UserContract", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  contract: {
    type: DataTypes.STRING(4000),
  },
  contract_signed: {
    type: DataTypes.STRING(4000),
  },
  seasonId: {
    type: DataTypes.STRING(255),
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  createdBy: {
    type: DataTypes.STRING(100),
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedBy: {
    type: DataTypes.STRING(100),
  },
});


// Relación entre User y UserContract
User.hasMany(UserContract, {
  foreignKey: "userId",
  sourceKey: "id",
});

UserContract.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
});

// Relación entre Contract y UserContract
Contract.hasMany(UserContract, {
  foreignKey: "contractId",
  sourceKey: "id",
});

UserContract.belongsTo(Contract, {
  foreignKey: "contractId",
  targetKey: "id",
});

module.exports = UserContract;
