import Category from "../models/Category.js";

// Helper to format name (Test, T Shirt, etc.)
const formatName = (value) => {
  return value
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export const insertCategory = async (req, res) => {
  try {
    let { name } = req.body;
    console.log("Inserting category:", name);

    if (!name || name.trim() === "") {
      return res.status(400).json({ msg: "Category name is required" });
    }

    name = formatName(name.trim());

    const exists = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (exists) {
      return res.status(400).json({ msg: "Category already exists" });
    }

    const category = await Category.create({ name });

    res.status(201).json(category);
  } catch (err) {
    console.error("Error inserting category:", err);
    res.status(500).json(err);
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let { name } = req.body;

    console.log("Updating category:", id, name);

    // Validate ID
    if (!id) {
      return res.status(400).json({ msg: "Category ID is required" });
    }

    // Validate name
    if (!name || name.trim() === "") {
      return res.status(400).json({ msg: "Category name is required" });
    }

    name = formatName(name.trim());

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // Check duplicate (exclude current category)
    const exists = await Category.findOne({
      _id: { $ne: id },
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (exists) {
      return res.status(400).json({ msg: "Category already exists" });
    }

    // Update
    category.name = name;
    await category.save();

    res.status(200).json(category);
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json(err);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ msg: "Category ID is required" });
    }

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // Delete category
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      msg: "Category deleted successfully",
      _id: id,
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json(err);
  }
};
