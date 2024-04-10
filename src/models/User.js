const { DataTypes } = require("sequelize");
const Sequelize = require("../database/database.js");
const bcrypt = require("bcrypt");
const Season = require("./Season.js");
const University = require("./University.js");

const User = Sequelize.define(
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
          args: [1, 100],
          msg: "El nombre debe tener entre 1 y 100 caracteres.",
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
          args: [1, 100],
          msg: "El apellido debe tener entre 1 y 100 caracteres.",
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
      type: DataTypes.STRING(30),
    },
    birthday: {
      type: DataTypes.STRING(100),
    },
    user_image: {
      type: DataTypes.STRING(255),
    },
    gender: {
      type: DataTypes.STRING(20),
      validate: {
        len: {
          args: [3, 255],
          msg: "El genero debe tener entre 3 y 20 caracteres.",
        },
      },
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
  },
  {
    //Se encrypta la contraseña
    hooks: {
      beforeCreate(user) {
        user.password = bcrypt.hashSync(
          user.password,
          bcrypt.genSaltSync(),
          null
        );
      },
    },
  }
);

// Metodo para comparar passwords
User.prototype.validarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Relación entre Season y User
Season.hasMany(User, {
  foreignKey: "seasonId",
  sourceKey: "id",
});

User.belongsTo(Season, {
  foreignKey: "seasonId",
  targetId: "id",
});

// Relación entre University y User
University.hasMany(User, {
  foreignKey: "universityId",
  sourceKey: "id",
});

User.belongsTo(University, {
  foreignKey: "universityId",
  targetId: "id",
});
module.exports = User;
