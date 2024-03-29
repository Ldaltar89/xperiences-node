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
    const token = await generarJWY(
      user.id,
      user.email,
      user.name,
      user.lastname,
      user.rol
    );

    return res.json({
      ok: true,
      msg: "Usuario Logueado",
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
      rol: user.rol,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const revalidateToken = async (req, res) => {
  const { id, email, name, lastname, rol } = req;

  const token = await generarJWY(id, email, name, lastname, rol);

  return res.status(200).json({
    ok: true,
    id,
    email,
    name,
    lastname,
    rol,
    token,
  });
};

module.exports = {
  loginUser,
  revalidateToken,
};
