const { Router } = require("express");
const {
  getQuestions,
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/question.controller.js");
const router = Router();
const { validarJWT } = require("../middlewares/validar-jwr.js");

router.use(validarJWT);

router.get("/", getQuestions);
router.post("/", createQuestion);
router.put("/:id", updateQuestion);
router.patch("/:id", deleteQuestion);
router.get("/:id", getQuestion);

module.exports = router;
