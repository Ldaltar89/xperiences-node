import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import bcrypt from "bcrypt";

export const User = sequelize.define(
  "User",
  {
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
          msg: "El nombre es obligatorio.",
        },
        len: {
          args: [5, 100],
          msg: "El nombre debe tener entre 5 y 100 caracteres.",
        },
      },
    },
    lastname: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El apellido es obligatorio.",
        },
        len: {
          args: [5, 100],
          msg: "El apellido debe tener entre 5 y 100 caracteres.",
        },
      },
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El DNI es obligatorio.",
        },
        len: {
          args: [10, 10],
          msg: "El DNI debe tener 10 caracteres.",
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        args: true,
        msg: "El correo electrónico ya está en uso.",
      },
      validate: {
        notEmpty: {
          msg: "El correo electrónico es obligatorio.",
        },
        isEmail: {
          msg: "El correo electrónico debe ser válido.",
        },
        len: {
          args: [5, 255],
          msg: "El correo electrónico debe tener entre 5 y 255 caracteres.",
        },
      },
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La contraseña es obligatoria.",
        },
        len: {
          args: [6, 60],
          msg: "La contraseña debe tener al menos 6 caracteres.",
        },
      },
    },
    rol: {
      type: DataTypes.STRING(255),
      validate: {
        isIn: {
          args: [["admin", "usuario"]],
          msg: 'El rol debe ser "admin" o "usuario".',
        },
      },
    },
    birthday: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: "La fecha de nacimiento debe ser válida.",
        },
      },
    },
    user_image: {
      type: DataTypes.STRING(255),
      validate: {
        isUrl: {
          msg: "La URL de la imagen del usuario debe ser válida.",
        },
      },
    },
    gender: {
      type: DataTypes.STRING(20),
      validate: {
        isIn: {
          args: [["masculino", "femenino"]],
          msg: 'El género debe ser "masculino" o "femenino".',
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    tokenPassword: { type: DataTypes.STRING },
    expiraToken: { type: DataTypes.DATE },
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
  },
  {
    hooks: {
      beforeCreate(user) {
        user.password = bcrypt.hashSync(
          user.password,
          bcrypt.genSaltSync(10),
          null
        );
      },
    },
  }
);

//Metodo para comparar passwords
User.prototype.validarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
