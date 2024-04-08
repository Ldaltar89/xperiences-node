const { Router } = require("express");
const {
  getShedules,
  createSchedule,
  getSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/schedule.controller.js");
const router = Router();
const { validarJWT } = require("../middlewares/validar-jwr.js");

router.use(validarJWT);

router.get("/",getShedules);
router.post("/",createSchedule);
router.put("/:id",updateSchedule);
router.patch("/:id",deleteSchedule);
router.get("/:id",getSchedule);

module.exports = router;
