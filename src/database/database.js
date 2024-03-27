const Sequelize = require("sequelize");
require("dotenv").config();

module.exports = new Sequelize(
  process.env.POSGRET_DB,
  process.env.POSGRET_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host:process.env.POSTGRES_HOST,
    dialect: "postgres",
    logging: false, // permite activar y desactivar los mensajes de la consola.
    dialectOptions: {
      useUTC: false, //for reading from database
    },
    timezone: "America/Guayaquil", //for writing to database
  },
  {
    // timesTamps:true
  }
);

