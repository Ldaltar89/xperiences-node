const { Router } = require("express");
const {
  getContracts,
  createContract,
  getContract,
  updateContract,
  deleteContract,
} = require("../controllers/contract.controller");
const router = Router();
const { validarJWT } = require("../middlewares/validar-jwr.js");

router.use(validarJWT);

router.get("/", getContracts);
router.post("/", createContract);
router.put("/:id", updateContract);
router.patch("/:id", deleteContract);
router.get("/:id", getContract);

module.exports = router;
