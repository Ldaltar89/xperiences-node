const { Router } = require("express");
const {
  getAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointment.controller.js");
const router = Router();
const { validarJWT } = require("../middlewares/validar-jwr.js");

router.use(validarJWT);

router.get("/", getAppointments);
router.post("/", createAppointment);
router.put("/:id", updateAppointment);
router.patch("/:id", deleteAppointment);
router.get("/:id", getAppointment);

module.exports = router;
