const { DataTypes } = require("sequelize");
const Sequelize = require("../database/database.js");
const ExamType = require("./ExamType.js");

const Exam = Sequelize.define("Exam", {
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
        msg: "El nombre del Examen es obligatorio.",
      },
      len: {
        args: [1, 100],
        msg: "La longitud del nombre debe estar entre 1 y 100 caracteres.",
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
  score: {
    type: DataTypes.DECIMAL(7, 2),
    validate: {
      isDecimal: {
        msg: "El puntaje debe ser un número decimal.",
      },
    },
  },
  score_pass: {
    type: DataTypes.DECIMAL(7, 2),
    validate: {
      isDecimal: {
        msg: "El puntaje mínimo de aprobación debe ser un número decimal.",
      },
    },
  },
  seasonId: {
    type: DataTypes.STRING(30),
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  seasonId: {
    type: DataTypes.STRING(255),
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

// Relación entre ExamType y Exam
ExamType.hasMany(Exam, {
  foreignKey: "examTypeId",
  sourceKey: "id",
});

Exam.belongsTo(ExamType, {
  foreignKey: "examTypeId",
  targetId: "id",
});

module.exports = Exam;
