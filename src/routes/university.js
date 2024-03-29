const { Router } = require("express");
const {
  createUniversity,
  deleteUniversity,
  getUniversities,
  getUniversity,
  updateUniversity,
} = require("../controllers/university.controller.js");

const router = Router();

const { validarJWT } = require("../middlewares/validar-jwr.js");

router.use(validarJWT);

router.get("/", getUniversities);
router.post("/", createUniversity);
router.put("/:id", updateUniversity);
router.patch("/:id", deleteUniversity);
router.get("/:id", getUniversity);

module.exports = router;
