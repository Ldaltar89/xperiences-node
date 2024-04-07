const { Router } = require("express");
const {
  loginUser,
  revalidateToken,
  getUserConfirmation,
  postVerificationEmail,
  getTokenVerification,
  postResetPassword,
} = require("../controllers/auth.controller.js");
const { validarJWT } = require("../middlewares/validar-jwr.js");

const router = Router();
router.post("/login", loginUser);
router.get("/renew", validarJWT, revalidateToken);
//Verificar Usuario
router.get("/verification/:token", getUserConfirmation);
//Verificar correo para reseteo de password
router.post("/verification/email", postVerificationEmail);
//Cambiar la contraseña
router.get("/verification/reset-password/:token", getTokenVerification);
router.post("/verification/resetPassword/", postResetPassword);

module.exports = router;
