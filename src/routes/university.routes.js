import { Router } from "express";
import {
  createUniversity,
  deleteUniversity,
  getUniversities,
  getUniversity,
  updateUniversity,
} from "../controllers/university.controller.js";

const router = Router();

router.get("/university", getUniversities);
router.post("/university", createUniversity);
router.put("/university/:id", updateUniversity);
router.patch("/university/:id", deleteUniversity);
router.get("/university/:id", getUniversity);

export default router;
