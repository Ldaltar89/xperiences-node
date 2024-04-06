const { response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const validarJWT = (req, res = response, next) => {
  //x-token headers
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }
  try {
    const { id } = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED
    );

    req.id = id;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }

  next();
};

module.exports = { validarJWT };
