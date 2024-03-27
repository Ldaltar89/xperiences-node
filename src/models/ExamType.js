const { DataTypes } = require("sequelize");
const Sequelize = require("../database/database.js");

const ExamType = Sequelize.define('ExamType', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
        notEmpty: {
          msg: "El Tipo de Examen es obligatorio.",
        },
        len: {
          args: [5, 100],
          msg: "El tipo de Examen debe tener entre 5 y 100 caracteres.",
        },
      },
  },
  description: {
    type: DataTypes.STRING(255),
    validate: {
        len: {
          args: [1, 255],
          msg: 'La descripción debe tener como máximo 255 caracteres.',
        },
      },
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

module.exports = ExamType;
