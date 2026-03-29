import express from "express";
import {
  deleteCategory,
  getAllCategories,
  insertCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/get-all", getAllCategories);
router.post("/create", insertCategory);
router.patch("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
