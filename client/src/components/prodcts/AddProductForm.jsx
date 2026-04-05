import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  TextField,
  MenuItem,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Modal,
  Paper,
  Divider,
} from "@mui/material";
import Alert from "../Alerts";
import { getAllCategories } from "../../store/functions/categories";

const categories = [
  { id: 1, name: "Clothing", subcategories: ["Shirts", "Pants", "Jackets"] },
  { id: 2, name: "Electronics", subcategories: ["Phones", "Laptops", "TVs"] },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL"];

const AddProductModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    shop: "",
    product: "",
    size: "",
    color: "",
    qty: 0,
    costPrice: 0,
    actualMrp: 0,
    category: "",
    subCategory: "",
  });
  const [selectedCategory, setSelectedCategory] = useState({});
  const [computed, setComputed] = useState({
    totalCost: 0,
    mrp: 0,
    actualRevenue: 0,
    recommendedRevenue: 0,
    profit: 0,
    actualProfit: 0,
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    const qty = Number(formData.qty) || 0;
    const costPrice = Number(formData.costPrice) || 0;
    const actualMrp = Number(formData.actualMrp) || 0;
    const mrp = costPrice * 1.25;

    setComputed({
      totalCost: qty * costPrice,
      mrp,
      actualRevenue: qty * actualMrp,
      recommendedRevenue: qty * mrp,
      profit: qty * mrp - qty * costPrice,
      actualProfit: qty * actualMrp - qty * costPrice,
    });
  }, [formData.qty, formData.costPrice, formData.actualMrp]);

  useEffect(() => {
    setSelectedCategory(
      categories.find((cat) => cat.name === formData.category),
    );
  }, [formData.category, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (Number(value) < 0) return;

    setFormData((prev) => {
      if (name === "category") {
        return {
          ...prev,
          category: value,
          subCategory: "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shop?.trim()) {
      newErrors.shop = "Shop is required";
    }

    if (!formData.product?.trim()) {
      newErrors.product = "Product is required";
    }

    if (!formData.color?.trim()) {
      newErrors.color = "Color is required";
    }

    if (!formData.size?.trim()) {
      newErrors.size = "Size required";
    }

    if (!formData.actualMrp) {
      newErrors.actualMrp = "Actual MRP is required";
    }

    if (!formData.qty) {
      newErrors.qty = "Quantity is required";
    }

    if (!formData.costPrice) {
      newErrors.costPrice = "Cost price is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category required";
    }

    if (!formData.subCategory.trim()) {
      newErrors.subCategory = "Sub category required";
    }

    return newErrors;
  };

  //   const selectedCategory = categories.find(
  //     (cat) => cat.name === formData.category,
  //   );

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const categoryId = selectedCategory?._id;
    const subCat = selectedCategory?.subcategories?.find(
      (sub) => sub.name === formData.subCategory,
    );
    const subCategoryCode = subCat?.code;

    const dataToSubmit = {
      shop: formData.shop,
      product: formData.product,
      size: formData.size,
      color: formData.color,
      qty: formData.qty,
      costPrice: formData.costPrice,
      actualMrp: formData.actualMrp,
      categoryId,
      subCategoryCode,
    };

    // setFormData({
    //   shop: "",
    //   product: "",
    //   size: "",
    //   color: "",
    //   qty: 0,
    //   costPrice: 0,
    //   actualMrp: 0,
    //   categoryId: "",
    //   subCategoryCode: "",
    // });

    // onClose();
    // Alert.success("success", "Product saved successfuly");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        onSubmit={handleSubmit}
        component="form"
        sx={{
          width: "100%",
          maxWidth: 800,
          mx: "auto",
          mt: 5,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" textAlign="center" mb={3}>
          Add New Category
        </Typography>

        {/* Row 1: Shop + Product */}
        <Stack direction="row" spacing={2} width="100%">
          <TextField
            label="Shop"
            name="shop"
            value={formData.shop}
            onChange={handleChange}
            fullWidth
            error={!!errors.shop}
            helperText={errors.shop}
          />
          <TextField
            label="Product"
            name="product"
            value={formData.product}
            onChange={handleChange}
            fullWidth
            error={!!errors.product}
            helperText={errors.product}
          />
        </Stack>

        {/* Row 2: Color + Size + Actual MRP under Product */}
        <Stack direction="row" spacing={2} width="100%">
          <Stack direction="row" width="50%" spacing={2}>
            <Stack direction="row" width="50%">
              <TextField
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                fullWidth
                error={!!errors.color}
                helperText={errors.color}
              />
            </Stack>

            <FormControl className="w-[50%]" error={!!errors.size}>
              <InputLabel>Size</InputLabel>
              <Select
                name="size"
                value={formData.size}
                onChange={handleChange}
                label="Size"
              >
                {sizes.map((cat, i) => (
                  <MenuItem key={i} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>

              <Typography variant="caption" color="error">
                {errors.size}
              </Typography>
            </FormControl>
          </Stack>

          <Stack direction="row" width="50%">
            <TextField
              type="number"
              label="Actual MRP"
              name="actualMrp"
              value={formData.actualMrp}
              onChange={handleChange}
              fullWidth
              error={!!errors.actualMrp}
              helperText={errors.actualMrp}
            />
          </Stack>
        </Stack>

        {/* Row 3: Quantity + Cost Price */}
        <Stack direction="row" spacing={2} width="100%">
          <TextField
            type="number"
            label="Quantity"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            fullWidth
            error={!!errors.qty}
            helperText={errors.qty}
          />
          <TextField
            type="number"
            label="Cost Price"
            name="costPrice"
            value={formData.costPrice}
            onChange={handleChange}
            fullWidth
            error={!!errors.costPrice}
            helperText={errors.costPrice}
          />
        </Stack>

        {/* Row 4: Category + Subcategory */}
        <Stack direction="column" spacing={2} width="100%">
          <FormControl error={!!errors?.category}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData?.category}
              onChange={handleChange}
              label="Category"
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>

            <Typography variant="caption" color="error">
              {errors?.category}
            </Typography>
          </FormControl>

          {selectedCategory?.subcategories?.length > 0 && (
            <FormControl error={!!errors?.subCategory}>
              <InputLabel>Subcategory</InputLabel>
              <Select
                name="subCategory"
                value={formData?.subCategory}
                onChange={handleChange}
                label="Subcategory"
              >
                {selectedCategory?.subcategories?.map((sub, idx) => (
                  <MenuItem key={idx} value={sub.name}>
                    {`${sub.name} (${sub.code})`}
                  </MenuItem>
                ))}
              </Select>

              <Typography variant="caption" color="error">
                {errors?.subCategory}
              </Typography>
            </FormControl>
          )}
        </Stack>

        <Paper
          elevation={3}
          sx={{ p: 3, mt: 1, borderRadius: 2, bgcolor: "#f9f9f9" }}
        >
          <Typography variant="h6" gutterBottom textAlign="center">
            Summary
          </Typography>
          <Divider sx={{ mb: 2, width: "50%", mx: "auto" }} />

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt={3}
            gap={1}
          >
            {/* Total Cost */}
            <Box display="flex" justifyContent="space-between" width="50%">
              <Typography variant="body2" color="text.secondary">
                Total Cost:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {computed.totalCost}
              </Typography>
            </Box>

            {/* MRP */}
            <Box display="flex" justifyContent="space-between" width="50%">
              <Typography variant="body2" color="text.secondary">
                MRP:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {computed.mrp}
              </Typography>
            </Box>

            {/* Actual Revenue */}
            <Box display="flex" justifyContent="space-between" width="50%">
              <Typography variant="body2" color="text.secondary">
                Actual Revenue:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {computed.actualRevenue}
              </Typography>
            </Box>

            {/* Recommended Revenue */}
            <Box display="flex" justifyContent="space-between" width="50%">
              <Typography variant="body2" color="text.secondary">
                Recommended Revenue:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {computed.recommendedRevenue}
              </Typography>
            </Box>

            {/* Profit */}
            <Box display="flex" justifyContent="space-between" width="50%">
              <Typography variant="body2" color="text.secondary">
                Profit:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {computed.profit}
              </Typography>
            </Box>

            {/* Actual Profit */}
            <Box display="flex" justifyContent="space-between" width="50%">
              <Typography variant="body2" color="text.secondary">
                Actual Profit:
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {computed.actualProfit}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded uppercase"
        >
          Add Product
        </button>
      </Box>
    </Modal>
  );
};

export default AddProductModal;
