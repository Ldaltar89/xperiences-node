const jwt = require("jsonwebtoken");
require("dotenv").config();

const generarJWY = async (id, email) => {
  return new Promise((resolve, reject) => {
    const payload = { id, email };
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "2h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        }
        resolve(token);
      }
    );
  });
};

module.exports = generarJWY;
