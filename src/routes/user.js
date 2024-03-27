const { Router } = require("express");
const router = Router();
const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserConfirmation,
} = require("../controllers/user.controller.js");

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.patch("/:id", deleteUser);
router.get("/:id", getUser);

//Confirmar cuenta
router.get("/verification/:email", getUserConfirmation);


module.exports = router;

