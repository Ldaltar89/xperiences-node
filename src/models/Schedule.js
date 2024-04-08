const { DataTypes } = require("sequelize");
const Sequelize = require("../database/database.js");

const Schedule = Sequelize.define("Schedule", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  TimeRangeInit: {
    type: DataTypes.TIME,
  },
  TimeRangeEnd: {
    type: DataTypes.TIME,
  },
  Day: {
    type: DataTypes.STRING(20),
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

module.exports = Schedule;
