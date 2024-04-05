const { DataTypes } = require("sequelize");
const Sequelize = require("../database/database.js");
const User = require("./User.js");
const Exam = require("./Exam.js");

const UserExam = Sequelize.define("User_examns", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  isDone: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
  },
  isDisapproved: {
    type: DataTypes.BOOLEAN,
  },
  isCanceled: {
    type: DataTypes.BOOLEAN,
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 20,
    },
  },
  season_id: {
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

User.hasMany(UserExam, {
  foreignKey: "userId",
  sourceKey: "id",
});

UserExam.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
});

Exam.hasMany(UserExam, {
  foreignKey: "examId",
  sourceKey: "id",
});

UserExam.belongsTo(Exam, {
  foreignKey: "examId",
  targetKey: "id",
});
module.exports = UserExam;
