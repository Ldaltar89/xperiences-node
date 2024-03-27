const { DataTypes } = require("sequelize");
const Sequelize = require("../database/database.js");
const User = require("./User.js");
const Contract = require("./Contract.js");


const Season = Sequelize.define("Season", {
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
        msg: "El nombre de la temporada es obligatorio.",
      },
      len: {
        args: [2, 100],
        msg: "El nombre de la temporada debe tener entre 2 y 100 caracteres.",
      },
    },
  },
  description: {
    type: DataTypes.STRING(255),
    validate: {
      len: {
        args: [1, 255],
        msg: "La descripción de la temporada debe tener entre 1 y 255 caracteres.",
      },
    },
  },
  season_year: {
    type: DataTypes.STRING(5),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "El año de la temporada es obligatorio.",
      },
      is: {
        args: /^\d{4}$/, // Expresión regular para validar que sea un año de cuatro dígitos
        msg: "El año de la temporada debe ser válido.",
      },
    },
  },
  season_image: {
    type: DataTypes.STRING(255),
    validate: {
      isUrl: {
        msg: "La URL de la imagen de la temporada debe ser válida.",
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

// Relación entre Season y User
Season.hasMany(User, {
  foreignKey: "seasonId",
  sourceKey: "id",
});

User.belongsTo(Season, {
  foreignKey: "seasonId",
  targetId: "id",
});

// Relación entre Season y Contract
Season.hasMany(Contract, {
  foreignKey: 'seasonId',
  sourceKey: 'id',
});

Contract.belongsTo(Season, {
  foreignKey: 'seasonId',
  targetKey: 'id',
});
module.exports = Season;
