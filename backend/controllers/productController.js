import Category from "../models/Category.js";
import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const insertProduct = async (req, res) => {
  try {
    const data = req.body;

    const [existingCat, existingProduct] = await Promise.all([
      Category.findById(data.categoryId),
      Product.findOne({
        product: { $regex: `^${data.product}$`, $options: "i" },
        size: { $regex: `^${data.size}$`, $options: "i" },
        color: { $regex: `^${data.color}$`, $options: "i" },
      }),
    ]);

    if (!existingCat) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const subCat = existingCat.subcategories.find(
      (sub) => sub.code === data.subCategoryCode,
    );
    if (!subCat) {
      return res.status(400).json({ message: "Invalid subcategory code" });
    }

    if (existingProduct) {
      return res.status(400).json({
        message: "Product with the same size and color already exists.",
      });
    }

    const totalCost = data.qty * data.costPrice;
    const mrp = data.costPrice * 1.25;
    const actualRevenue = data.qty * data.actualMrp;
    const recommendedRevenue = data.qty * mrp;
    const profit = recommendedRevenue - totalCost;
    const actualProfit = actualRevenue - totalCost;

    const newProduct = new Product({
      date: new Date().toISOString().split("T")[0],
      shop: data.shop,
      product: data.product,
      size: data.size,
      color: data.color,
      qty: data.qty,
      costPrice: data.costPrice,
      totalCost,
      actualMrp: data.actualMrp,
      mrp,
      actualRevenue,
      recommendedRevenue,
      profit,
      actualProfit,
      categoryId: data.categoryId,
      subCategoryCode: data.subCategoryCode,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate category
    const category = await Category.findById(data.categoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const subCat = category.subcategories.find(
      (sub) => sub.code === data.subCategoryCode,
    );
    if (!subCat) {
      return res.status(400).json({ message: "Invalid subcategory code" });
    }

    // Check for duplicate product with same size and color (exclude current product)
    const existingProduct = await Product.findOne({
      _id: { $ne: id },
      product: { $regex: `^${data.product}$`, $options: "i" },
      size: { $regex: `^${data.size}$`, $options: "i" },
      color: { $regex: `^${data.color}$`, $options: "i" },
    });
    if (existingProduct) {
      return res.status(400).json({
        message: "Another product with the same size and color already exists.",
      });
    }

    // Recalculate costs and profits
    const totalCost = data.qty * data.costPrice;
    const mrp = data.costPrice * 1.25;
    const actualRevenue = data.qty * data.actualMrp;
    const recommendedRevenue = data.qty * mrp;
    const profit = recommendedRevenue - totalCost;
    const actualProfit = actualRevenue - totalCost;

    // Update product fields
    product.shop = data.shop;
    product.product = data.product;
    product.size = data.size;
    product.color = data.color;
    product.qty = data.qty;
    product.costPrice = data.costPrice;
    product.totalCost = totalCost;
    product.actualMrp = data.actualMrp;
    product.mrp = mrp;
    product.actualRevenue = actualRevenue;
    product.recommendedRevenue = recommendedRevenue;
    product.profit = profit;
    product.actualProfit = actualProfit;
    product.categoryId = data.categoryId;
    product.subCategoryCode = data.subCategoryCode;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted successfully",
      _id: id,
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: err.message });
  }
};
