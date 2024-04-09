const { DataTypes } = require("sequelize");
const sequelize = require("../database/database.js");
const Schedule = require("./Schedule.js");
const User = require("./User.js");

const Appointment = sequelize.define("Appointment", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  ScheduleDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
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

Schedule.hasMany(Appointment, {
  foreignKey: "scheduleId",
  sourceKey: "id",
});

Appointment.belongsTo(Schedule, {
  foreignKey: "scheduleId",
  targetKey: "id",
});

User.hasMany(Appointment, {
  foreignKey: "userId",
  sourceKey: "id",
});

Appointment.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
});

module.exports = Appointment;
