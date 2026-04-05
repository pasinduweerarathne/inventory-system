import express from "express";
import {
  getAllProducts,
  insertProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/all", getAllProducts);
router.post("/create", insertProduct);

export default router;
