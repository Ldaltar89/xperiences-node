const { Router } = require("express");
const {
  getExams,
  createExam,
  getExam,
  updateExam,
  deleteExam,
} = require("../controllers/Exam.controller");
const router = Router();

const { validarJWT } = require("../middlewares/validar-jwr.js");

router.use(validarJWT);

router.get("/",getExams);
router.post("/",createExam);
router.put("/:id",updateExam);
router.patch("/:id",deleteExam);
router.get("/:id",getExam);

module.exports = router;
