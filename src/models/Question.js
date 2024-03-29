const { DataTypes } = require("sequelize");
const Sequelize = require("../database/database.js");

const Question = Sequelize.define("Question", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  question: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "La pregunta es obligatoria.",
      },
      len: {
        args: [1, 255],
        msg: "La longitud de la pregunta debe estar entre 1 y 255 caracteres.",
      },
    },
  },
  description: {
    type: DataTypes.STRING(255),
    validate: {
      len: {
        args: [0, 255],
        msg: "La longitud de la descripción debe estar entre 0 y 255 caracteres.",
      },
    },
  },
  question_type: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "El tipo de pregunta es obligatorio.",
      },
    },
  },
  question_image: {
    type: DataTypes.STRING(255),
  },
  question_audio: {
    type: DataTypes.STRING(255),
  },
  points: {
    type: DataTypes.DECIMAL(7, 2),
    validate: {
      isDecimal: {
        msg: "Los puntos deben ser un número decimal.",
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

module.exports = Question;
