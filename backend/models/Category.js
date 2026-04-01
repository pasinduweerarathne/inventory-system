import mongoose from "mongoose";

// Subcategory schema
const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: Number, required: true },
});

// Category schema
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    rangeStart: { type: Number, required: true },
    rangeEnd: { type: Number, required: true },
    subcategories: [subCategorySchema],
  },
  { timestamps: true },
);

export default mongoose.model("Category", categorySchema);
