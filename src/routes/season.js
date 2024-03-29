const { Router } = require("express");
const {
  createSeason,
  deleteSeason,
  getSeason,
  getSeasons,
  updateSeason,
} = require("../controllers/season.controller.js");

const router = Router();
const { validarJWT } = require("../middlewares/validar-jwr.js");

router.use(validarJWT);

router.get("/", getSeasons);
router.post("/", createSeason);
router.put("/:id", updateSeason);
router.patch("/:id", deleteSeason);
router.get("/:id", getSeason);

module.exports = router;
