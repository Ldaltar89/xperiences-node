import { Router } from "express";
import {
  createSeason,
  deleteSeason,
  getSeason,
  getSeasons,
  updateSeason,
} from "../controllers/season.controller.js";

const router = Router();

router.get("/season", getSeasons);
router.post("/season", createSeason);
router.put("/season/:id", updateSeason);
router.patch("/season/:id", deleteSeason);
router.get("/season/:id", getSeason);

export default router;
