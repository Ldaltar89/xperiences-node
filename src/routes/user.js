const { Router } = require("express");
const router = Router();
const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserConfirmation,
  postVerificationEmail
} = require("../controllers/user.controller.js");
const { validarJWT } = require("../middlewares/validar-jwr.js");

router.get("/", validarJWT,getUsers);
router.post("/", createUser);
router.put("/:id", validarJWT,updateUser);
router.patch("/:id", validarJWT,deleteUser);
router.get("/:id", validarJWT,getUser);



module.exports = router;
