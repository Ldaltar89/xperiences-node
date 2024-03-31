const jwt = require("jsonwebtoken");
require("dotenv").config();

const generarJWY = async (
  id,
  email,
  name,
  lastname,
  isClient,
  isEmployed,
  isAdmin
) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id,
      email,
      name,
      lastname,
      isClient,
      isEmployed,
      isAdmin,
    };
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "24h",
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
