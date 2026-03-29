import express from "express";
import { createAdmin, loginAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/create", createAdmin);
router.post("/login", loginAdmin);

export default router;
