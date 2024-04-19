const { DataTypes } = require("sequelize");
const Sequelize = require("../database/database.js");
const User = require("./User.js");

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
    type: DataTypes.STRING(50),
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
  concept: {
    type: DataTypes.STRING(20),
  },
  description: {
    type: DataTypes.STRING(255),
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
  },
  isApproved: {
    type: DataTypes.STRING,
  },
  isRejected: {
    type: DataTypes.STRING,
  },
  isCancelled: {
    type: DataTypes.STRING,
  },
  seasonId: {
    type: DataTypes.STRING(30),
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

// Relación entre User y Payment
User.hasMany(Payment, {
  foreignKey: "userId",
  sourceKey: "id",
});

Payment.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
});

module.exports = Payment;
