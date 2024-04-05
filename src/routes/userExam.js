const { Router } = require("express");
const {
  getUserExams,
  createUserExam,
  getUserExam,
  updateUserExam,
  deleteUserExam,
} = require("../controllers/userExam.controller.js");

const router = Router();
const { validarJWT } = require("../middlewares/validar-jwr.js");

router.use(validarJWT);

router.get("/",getUserExams);
router.post("/",createUserExam);
router.put("/:id",updateUserExam);
router.patch("/:id",deleteUserExam);
router.get("/:id",getUserExam);

module.exports = router;
