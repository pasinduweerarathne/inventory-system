import Category from "../models/Category.js";

// Helper to format name (Test, T Shirt, etc.)
const formatName = (value) => {
  return value
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const insertCategory = async (req, res) => {
  try {
    let { name, rangeStart, rangeEnd } = req.body;

    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ msg: "Category name is required" });
    }
    if (!rangeStart || !rangeEnd) {
      return res
        .status(400)
        .json({ msg: "Both rangeStart and rangeEnd are required" });
    }
    if (rangeStart >= rangeEnd) {
      return res
        .status(400)
        .json({ msg: "rangeStart must be less than rangeEnd" });
    }

    name = formatName(name.trim());

    // Check for duplicate name
    const exists = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (exists) {
      return res.status(400).json({ msg: "Category already exists" });
    }

    // Create category
    const category = await Category.create({
      name,
      rangeStart,
      rangeEnd,
      subcategories: [],
    });

    res.status(201).json(category);
  } catch (err) {
    console.error("Error inserting category:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let data = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({ msg: "Category ID is required" });
    }

    // Validate name
    if (!data.name || data.name.trim() === "") {
      return res.status(400).json({ msg: "Category name is required" });
    }

    data.name = formatName(data.name.trim());

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // Check duplicate (exclude current category)
    const exists = await Category.findOne({
      _id: { $ne: id },
      name: { $regex: `^${data.name}$`, $options: "i" },
    });

    if (exists) {
      return res.status(400).json({ msg: "Category already exists" });
    }

    // Update
    category.name = data.name;
    category.rangeStart = data.rangeStart;
    category.rangeEnd = data.rangeEnd;
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

export const addSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    let { name, code } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ msg: "Subcategory name is required" });
    }

    if (code === undefined || code === null) {
      return res.status(400).json({ msg: "Subcategory code is required" });
    }

    code = Number(code);
    if (isNaN(code)) {
      return res.status(400).json({ msg: "Subcategory code must be a number" });
    }

    name = name.trim();

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // Check code is within range
    if (code < category.rangeStart || code > category.rangeEnd) {
      return res.status(400).json({
        msg: `Subcategory code must be between ${category.rangeStart} and ${category.rangeEnd}`,
      });
    }

    // Check code is not already used
    const usedCodes = category.subcategories.map((sub) => sub.code);
    if (usedCodes.includes(code)) {
      return res.status(400).json({
        msg: `Subcategory code ${code} is already used`,
      });
    }

    const usedNames = category.subcategories.map((sub) => sub.name);
    if (usedNames.includes(name)) {
      return res.status(400).json({
        msg: `Subcategory name ${name} is already used`,
      });
    }

    const newSub = { name, code };

    category.subcategories.push(newSub);
    await category.save();

    res.status(201).json({ msg: "Subcategory added", subcategory: newSub });
  } catch (err) {
    console.error("Error adding subcategory:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { categoryId, code } = req.params;
    let updatedSub = req.body;

    if (code === undefined) {
      return res
        .status(400)
        .json({ msg: "Original subcategory code is required" });
    }

    if (!updatedSub || !updatedSub.name || updatedSub.name.trim() === "") {
      return res.status(400).json({ msg: "Subcategory name is required" });
    }

    if (updatedSub.code === undefined || updatedSub.code === null) {
      return res.status(400).json({ msg: "Subcategory code is required" });
    }

    const newCode = Number(updatedSub.code);
    if (isNaN(newCode)) {
      return res.status(400).json({ msg: "Subcategory code must be a number" });
    }

    const newName = updatedSub.name.trim();

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // Find subcategory by original code
    const subIndex = category.subcategories.findIndex(
      (sub) => sub.code === Number(code),
    );

    if (subIndex === -1) {
      return res.status(404).json({ msg: "Subcategory not found" });
    }

    // Check new code is within category range
    if (newCode < category.rangeStart || newCode > category.rangeEnd) {
      return res.status(400).json({
        msg: `Subcategory code must be between ${category.rangeStart} and ${category.rangeEnd}`,
      });
    }

    // Check for duplicate code or name among other subcategories
    const usedCodes = category.subcategories
      .filter((sub) => sub.code !== Number(code))
      .map((sub) => sub.code);

    if (usedCodes.includes(newCode)) {
      return res
        .status(400)
        .json({ msg: `Subcategory code ${newCode} is already used` });
    }

    const usedNames = category.subcategories
      .filter((sub) => sub.code !== Number(code))
      .map((sub) => sub.name);

    if (usedNames.includes(newName)) {
      return res
        .status(400)
        .json({ msg: `Subcategory name "${newName}" is already used` });
    }

    // Update subcategory
    category.subcategories[subIndex].name = newName;
    category.subcategories[subIndex].code = newCode;

    await category.save();

    res.status(200).json({
      msg: "Subcategory updated successfully",
      subcategory: category.subcategories[subIndex],
    });
  } catch (err) {
    console.error("Error updating subcategory:", err);
    res.status(500).json({ msg: err.message });
  }
};

export const removeSubCategory = async (req, res) => {
  try {
    const { categoryId, code } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    const codeNumber = Number(code);
    if (isNaN(codeNumber)) {
      return res.status(400).json({ msg: "Subcategory code must be a number" });
    }

    // Check if subcategory exists
    const subIndex = category.subcategories.findIndex(
      (sub) => sub.code === codeNumber,
    );

    if (subIndex === -1) {
      return res
        .status(404)
        .json({ msg: `Subcategory with code ${code} not found` });
    }

    // Remove subcategory
    const removedSub = category.subcategories.splice(subIndex, 1)[0];
    await category.save();

    res.status(200).json({
      msg: "Subcategory removed successfully",
      subcategory: removedSub,
    });
  } catch (err) {
    console.error("Error removing subcategory:", err);
    res.status(500).json({ msg: err.message });
  }
};
