import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import { FaHome, FaPlus } from "react-icons/fa";
import CustomDataTable from "../components/CustomDataTable";
import AddProductForm from "../components/prodcts/AddProductForm";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../store/functions/products";
import { useEffect } from "react";

const columns = [
  { header: "Date", accessor: "createdAt" },
  { header: "Shop", accessor: "shop" },
  { header: "Product", accessor: "product" },
  { header: "QTY", accessor: "qty" },
  { header: "Size", accessor: "size" },
  { header: "Color", accessor: "color" },
  { header: "Cost Price", accessor: "costPrice" },
  { header: "Total Cost", accessor: "totalCost" },
  { header: "Actual MRP", accessor: "actualMrp" },
  { header: "MRP", accessor: "mrp" },
  { header: "Actual Revenue", accessor: "actualRevenue" },
  { header: "Recommended Revenue", accessor: "recommendedRevenue" },
  { header: "Profit", accessor: "profit" },
  { header: "Actual Profit", accessor: "actualProfit" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL"];

const Products = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const groupWithChildren = (products) => {
    return [...products].sort((a, b) => {
      // 1️⃣ sort by product name
      if (a.product !== b.product) {
        return a.product.localeCompare(b.product);
      }

      // 2️⃣ sort by size according to sizes array
      const sizeA = sizes.indexOf(a.size);
      const sizeB = sizes.indexOf(b.size);
      if (sizeA !== sizeB) return sizeB - sizeA;

      // 3️⃣ if size same, sort by color alphabetically
      return a.color.localeCompare(b.color);
    });
  };

  const groupedData = groupWithChildren(products);
  const formattedProducts = groupedData.map((product) => ({
    ...product,
    createdAt: new Date(product.createdAt).toLocaleString(), // converts to readable format
  }));

  return (
    <div>
      <Box
        mb={4}
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        gap={2}
      >
        {/* Breadcrumb */}
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ fontSize: 14, color: "text.secondary" }}
        >
          <Link
            underline="hover"
            color="inherit"
            href="#"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <FaHome /> Home
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            Products
          </Typography>
        </Breadcrumbs>

        {/* Title + Add Button */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Products
          </Typography>

          <button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded shadow transition-all cursor-pointer"
            onClick={() => {
              setCurrentProduct(null);
              setOpenAddProductModal(true);
            }}
          >
            <FaPlus />
            Add Product
          </button>
        </Box>
      </Box>

      <CustomDataTable columns={columns} data={formattedProducts} />

      <AddProductForm
        open={openAddProductModal}
        onClose={() => setOpenAddProductModal(false)}
      />
    </div>
  );
};

export default Products;
