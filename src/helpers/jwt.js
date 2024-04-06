const jwt = require("jsonwebtoken");
require("dotenv").config();

const generarJWY = async (id, time) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id,
    };
    const expiresIn = time
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn
      },
      (err, token) => {
        if (err) {
          reject("No se pudo generar el token");
        }
        resolve(token);
      }
    );
  });
};

module.exports = generarJWY;
