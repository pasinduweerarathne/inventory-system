import express from "express";
import {
  addSubCategory,
  deleteCategory,
  getAllCategories,
  insertCategory,
  removeSubCategory,
  updateCategory,
  updateSubCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/get-all", getAllCategories);
router.post("/create", insertCategory);
router.patch("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

router.post("/add-subcategory/:categoryId", addSubCategory);
router.patch("/update-subcategory/:categoryId/:code", updateSubCategory);
router.delete("/remove-subcategory/:categoryId/:code", removeSubCategory);

export default router;
