const { Router } = require("express");
const {
  getExamTypes,
  createExamType,
  getExamType,
  updateExamType,
  deleteExamType,
} = require("../controllers/ExamType.controller.js");
const router = Router();

const { validarJWT } = require("../middlewares/validar-jwr.js");

router.use(validarJWT);

router.get("/", getExamTypes);
router.post("/", createExamType);
router.put("/:id", updateExamType);
router.patch("/:id", deleteExamType);
router.get("/:id", getExamType);

module.exports = router;
