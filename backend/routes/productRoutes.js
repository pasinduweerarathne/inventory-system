import express from "express";
import {
  deleteProduct,
  getAllProducts,
  insertProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/all", getAllProducts);
router.post("/create", insertProduct);
router.patch("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
