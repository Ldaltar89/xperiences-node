const { DataTypes } = require("sequelize");
const Sequelize = require("../database/database.js");
const UserContract = require("./UserContract.js");


const Contract = Sequelize.define('Contract', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "El nombre del contrato es obligatorio."
      },
      len: {
        args: [2, 100],
        msg: "El nombre del contrato debe tener entre 2 y 100 caracteres.",
      },
    }
  },
  description: {
    type: DataTypes.STRING(255),
    validate: {
      len: {
        args: [1, 255],
        msg: "La descripción del contrato debe tener entre 2 y 255 caracteres."
      }
    }
  },
  contract: {
    type: DataTypes.STRING(4000),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "El contrato es obligatorio."
      },
      len: {
        args: [1, 4000],
        msg: "La longitud del contenido del contrato debe estar entre 1 y 4000 caracteres."
      }
    }
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

// Relación entre Contract y UserContract
Contract.hasMany(UserContract, {
  foreignKey: 'contractId',
  sourceKey: 'id',
});

UserContract.belongsTo(Contract, {
  foreignKey: 'contractId',
  targetKey: 'id',
});



module.exports = Contract;
