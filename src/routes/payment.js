const { Router } = require("express");
const {
  getPayments,
  createPayment,
  updatePayment,
  deletedPayment,
  getPayment,
} = require("../controllers/payment.controller.js");

const router = Router();

const { validarJWT } = require("../middlewares/validar-jwr.js");

router.use(validarJWT);

router.get("/", getPayments);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.patch("/:id", deletedPayment);
router.get("/:id", getPayment);

module.exports = router;
