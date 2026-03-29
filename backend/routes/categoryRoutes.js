import express from "express";
import {
  getAllCategories,
  insertCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/get-all", getAllCategories);
// router.get("/get/:id", getCategory);
router.post("/create", insertCategory);
// router.patch("/update/:id", updateCategory);
// router.delete("/delete/:id", deleteCategory);

export default router;
