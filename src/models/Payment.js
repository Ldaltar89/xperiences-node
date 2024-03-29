const { DataTypes } = require("sequelize");
const Sequelize = require("../database/database.js");

const Payment = Sequelize.define("Payment", {
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
        args: [1, 255],
        msg: "La longitud del nombre debe estar entre 1 y 255 caracteres.",
      },
    },
  },
  reference: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      args: true,
      msg: "La referencia ya fue usada.",
    },
    validate: {
      notEmpty: {
        msg: "La referencia es obligatoria.",
      },
      len: {
        args: [1, 255],
        msg: "La longitud de la referencia debe estar entre 1 y 255 caracteres.",
      },
    },
  },
  description: {
    type: DataTypes.STRING(255),
    validate: {
      len: {
        args: [1, 255],
        msg: "La longitud de la descripción debe estar entre 1 y 255 caracteres.",
      },
    },
  },
  total: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      isDecimal: {
        msg: "El total debe ser un número decimal.",
      },
    },
  },
  imagen: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "La URL de la imagen es obligatoria.",
      },
      isUrl: {
        msg: "La URL de la imagen debe ser válida.",
      },
    },
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isRejected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isCancel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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

module.exports = Payment;
