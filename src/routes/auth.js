
const { Router } = require("express");
const { loginUser } = require("../controllers/auth.controller.js");

const router = Router();
router.post("/login", loginUser);

module.exports = router;
