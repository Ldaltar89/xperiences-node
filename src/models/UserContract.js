const { DataTypes } = require("sequelize");
const sequelize = require("../database/database.js");
const UserContract = sequelize.define("UserContract", {
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

module.exports = UserContract;
