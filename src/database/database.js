import Sequelize from "sequelize";

export const sequelize = new Sequelize(
  "xperiences",
  "postgres",
  "mysecretpassword",
  {
    host: "localhost",
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
