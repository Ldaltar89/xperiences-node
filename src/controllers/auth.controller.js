const User = require("../models/User.js");
const generarJWY = require("../helpers/jwt.js");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, isActive: true } });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe o la cuenta no está activa",
      });
    }
    const verificarPass = await user.validarPassword(password);
    if (!verificarPass)
      return res.status(400).json({
        msg: "Password Incorrecto",
      });

    //Generar nuestro JWT
    const token = await generarJWY(user.id, user.email);
    console.log(token, "sdfsdf");

    return res.json({
      ok: true,
      msg: "Usuario Loegueado",
      id: user.id,
      email: user.email,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const revalidateToken = async (req, res) => {
  const { email, password } = req.body;
  res.json({
    ok: true,
    msg: "token",
    email,
    password,
  });
};

module.exports = {
  loginUser,
  revalidateToken,
};
