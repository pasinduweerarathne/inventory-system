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
