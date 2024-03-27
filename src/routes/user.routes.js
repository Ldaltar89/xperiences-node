import { Router } from "express";
import { check } from "express-validator";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = Router();
router.get("/user", getUsers);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.patch("/user/:id", deleteUser);
router.get("/user/:id", getUser);

export default router;
