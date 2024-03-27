import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { User } from "./User.js";

export const University = sequelize.define("University", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "El nombre de la universidad es obligatorio.",
      },
    },
  },
  type: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "El tipo de universidad es obligatorio.",
      },
      isIn: {
        args: [["Privada", "Pública"]],
        msg: 'El tipo de universidad debe ser "Privada" o "Pública".',
      },
    },
  },
  location: {
    type: DataTypes.STRING(255),
  },
  website: {
    type: DataTypes.STRING(255),
    validate: {
      isUrl: {
        msg: "El sitio web de la universidad debe ser una URL válida.",
      },
    },
  },
  email: {
    type: DataTypes.STRING(255),
    validate: {
      isEmail: {
        msg: "El correo electrónico de la universidad debe ser válido.",
      },
    },
  },
  phone: {
    type: DataTypes.STRING(255),
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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

University.hasMany(User, {
  foreignKey: "universityId",
  sourceKey: "id",
});

User.belongsTo(University, {
  foreignKey: "universityId",
  targetId: "id",
});
