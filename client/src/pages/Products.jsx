import {
  Box,
  Breadcrumbs,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  FaEdit,
  FaEllipsisV,
  FaEye,
  FaHome,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import CustomDataTable from "../components/CustomDataTable";
import AddProductForm from "../components/prodcts/AddProductForm";
import { Provider, shallowEqual, useDispatch, useSelector } from "react-redux";
import { deleteProduct, getAllProducts } from "../store/functions/products";
import { useEffect } from "react";
import Alert from "../components/Alerts";
import Categories from "./Categories";

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL"];

const Products = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  const dispatch = useDispatch();
  const { products, categories } = useSelector(
    (state) => ({
      products: state.products.products,
      categories: state.categories.categories,
    }),
    shallowEqual,
  );

  const columns = [
    { header: "Date", accessor: "createdAt" },
    { header: "Shop", accessor: "shop" },
    { header: "Product", accessor: "product" },
    { header: "QTY", accessor: "qty" },
    { header: "Size", accessor: "size" },
    { header: "Color", accessor: "color" },
    { header: "Category", accessor: "categoryId" },
    { header: "Sub Category", accessor: "subCategoryCode" },
    { header: "Cost Price", accessor: "costPrice" },
    { header: "Total Cost", accessor: "totalCost" },
    { header: "Actual MRP", accessor: "actualMrp" },
    { header: "MRP", accessor: "mrp" },
    { header: "Actual Revenue", accessor: "actualRevenue" },
    { header: "Recommended Revenue", accessor: "recommendedRevenue" },
    { header: "Profit", accessor: "profit" },
    { header: "Actual Profit", accessor: "actualProfit" },
    {
      header: "Actions",
      accessor: "actions",
      render: (_, row) => {
        const open = Boolean(menuAnchor) && menuRow === row._id;

        return (
          <Box>
            <Tooltip title="Actions">
              <IconButton size="small" onClick={(e) => handleClick(e, row)}>
                <FaEllipsisV />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={menuAnchor}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  sx: {
                    width: 200,
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                    borderRadius: 1,
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleProductEdit(row);
                  handleClose();
                }}
              >
                <FaEdit style={{ marginRight: 8 }} className="text-green-500" />{" "}
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleProductDelete(row);
                  handleClose();
                }}
              >
                <FaTrash style={{ marginRight: 8 }} className="text-red-500" />{" "}
                Delete
              </MenuItem>
            </Menu>
          </Box>
        );
      },
    },
  ];

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
  const formattedProducts = groupedData.map((product) => {
    const category = categories?.find((cat) => cat._id === product.categoryId);
    const subCategory = category?.subcategories?.find(
      (subCate) => subCate.code === product.subCategoryCode,
    );

    return {
      ...product,
      createdAt: new Date(product.createdAt).toLocaleString(),
      categoryId: category?.name,
      subCategoryCode: `${subCategory?.name} (${subCategory?.code})`,
    };
  });

  const handleClick = (event, row) => {
    setMenuAnchor(event.currentTarget);
    setMenuRow(row._id);
  };

  const handleClose = () => {
    setMenuAnchor(null);
    setMenuRow(null);
  };

  const handleProductDelete = (row) => {
    setMenuAnchor(null);
    Alert.delete(
      `This action will permanently delete product "${row.product}".`,
      row.product,
      "text",
    ).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProduct({ id: row._id })).then((data) => {
          if (data.meta.requestStatus === "fulfilled") {
            Alert.success("Deleted", "Product deleted successfully");
            dispatch(getAllProducts());
          } else {
            Alert.error("Error", data.payload || "Failed to delete category");
          }
        });
      }
    });
  };

  const handleProductEdit = (row) => {
    setOpenAddProductModal(true);
    setSelectedProduct(row);
  };

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
        onClose={() => {
          setOpenAddProductModal(false);
          setSelectedProduct(null);
        }}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default Products;
