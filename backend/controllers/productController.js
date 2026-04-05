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
