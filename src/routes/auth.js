const { Router } = require("express");
const {
  loginUser,
  revalidateToken,
} = require("../controllers/auth.controller.js");
const { validarJWT } = require("../middlewares/validar-jwr.js");

const router = Router();
router.post("/login", loginUser);
router.get("/renew", validarJWT, revalidateToken);

module.exports = router;
