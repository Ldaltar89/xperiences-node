// const { DataTypes } = require("sequelize");
// const Sequelize = require("../database/database.js");
// const User = require('./User.js')

// const Rol = Sequelize.define('Rol', {
//   id: {
//     type: DataTypes.UUID,
//     primaryKey: true,
//     defaultValue: DataTypes.UUIDV4
//   },
//   name: {
//     type: DataTypes.STRING(100),
//     allowNull: false,
//     validate: {
//       notEmpty: {
//         msg: "El nombre del rol es obligatorio."
//       },
//       len: {
//         args: [2, 100],
//         msg: "El nombre del rol debe tener entre 2 y 100 caracteres."
//       },
//     }
//   },
//   description: {
//     type: DataTypes.STRING(255),
//   },
//   isActive: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true,
//   },
//   createdAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   createdBy: {
//     type: DataTypes.STRING(100),
//   },
//   updatedAt: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   updatedBy: {
//     type: DataTypes.STRING(100),
//   },
// });

// Relación entre Rol y User
// Rol.hasMany(User, {
//   foreignKey: 'rolId',
//   sourceKey: 'id',
// });

// User.belongsTo(Rol, {
//   foreignKey: 'rolId',
//   targetKey: 'id',
// });

// module.exports = Rol;
