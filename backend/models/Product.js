import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    shop: { type: String, required: true, trim: true },
    product: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 1 },
    costPrice: { type: Number, required: true },
    actualMrp: { type: Number, required: true },
    categoryId: { type: String, required: true },
    subCategoryCode: { type: Number, required: true },
    totalCost: { type: Number },
    mrp: { type: Number },
    actualRevenue: { type: Number },
    recommendedRevenue: { type: Number },
    profit: { type: Number },
    actualProfit: { type: Number },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
