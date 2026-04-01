import React, { useEffect, useState } from "react";
import CustomDataTable from "../components/CustomDataTable";
import {
  deleteCategory,
  deleteSubCategory,
  getAllCategories,
  insertCategory,
  insertSubCategory,
  updateCategory,
  updateSubCategory,
} from "../store/functions/categories";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  FaEdit,
  FaEllipsisV,
  FaEye,
  FaHome,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import Alert from "../components/Alerts";
import Swal from "sweetalert2";

const Categories = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openSubcategoryModal, setOpenSubcategoryModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  const columns = [
    { header: "Category Name", accessor: "name" },
    { header: "Range Start", accessor: "rangeStart" },
    { header: "Range End", accessor: "rangeEnd" },
    {
      header: "Subcategories",
      accessor: "subcategories",
      render: (value, row) =>
        value && value.length > 0 ? (
          <Stack direction="row" flexWrap="wrap" sx={{ gap: "8px 8px" }}>
            {value.filter(Boolean).map((sub, i) => (
              <Chip
                key={i}
                label={`${sub.name} (${sub.code})`}
                size="small"
                onClick={() => handleSubCategoryActions(row, sub)}
              />
            ))}
          </Stack>
        ) : (
          <span style={{ color: "#999", fontStyle: "italic" }}>
            No subcategories available
          </span>
        ),
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (_, row) => {
        const open = Boolean(menuAnchor) && menuRow === row;

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
                  handleView(menuRow);
                  handleClose();
                }}
              >
                <FaEye style={{ marginRight: 8 }} className="text-blue-500" />{" "}
                View
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleEdit(menuRow);
                  handleClose();
                }}
              >
                <FaEdit style={{ marginRight: 8 }} className="text-green-500" />{" "}
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleDelete(menuRow);
                  handleClose();
                }}
              >
                <FaTrash style={{ marginRight: 8 }} className="text-red-500" />{" "}
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleAddSubcategory(menuRow);
                  handleClose();
                }}
              >
                <FaPlus style={{ marginRight: 8 }} className="text-green-500" />{" "}
                Add Subcategory
              </MenuItem>
            </Menu>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleClick = (event, row) => {
    setMenuAnchor(event.currentTarget);
    setMenuRow(row);
  };

  const handleClose = () => {
    setMenuAnchor(null);
    setMenuRow(null);
  };

  const handleView = (row) => {
    console.log(row);
  };

  const handleEdit = (row) => {
    setCurrentCategory(row);
    setOpenModal(true);
  };

  const handleDelete = (row) => {
    setMenuAnchor(null);
    Alert.delete(
      `This action will permanently delete category "${row.name}" and all its sub-categories.`,
      row.name,
      "text",
    ).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCategory({ id: row._id })).then((data) => {
          if (data.meta.requestStatus === "fulfilled") {
            Alert.success("Deleted", "Category deleted successfully");
            dispatch(getAllCategories());
          } else {
            Alert.error("Error", data.payload || "Failed to delete category");
          }
        });
      }
    });
  };

  const handleAddSubcategory = (category) => {
    setOpenSubcategoryModal(true);
    setCurrentCategory(category);
  };

  const handleSubCategoryActions = (category, sub) => {
    Swal.fire({
      title: "Manage Sub-category",
      html: `
      <div class="text-left">
        <p class="text-gray-700">
          What would you like to do with this sub-category?
        </p>

        <div class="mt-3 p-3 rounded bg-gray-100">
          <p><strong>Name:</strong> ${sub.name}</p>
          <p><strong>Code:</strong> <span class="text-blue-600 font-semibold">${sub.code}</span></p>
        </div>

        <p class="mt-3 text-sm text-gray-500">
          You can edit the details or permanently delete this sub-category.
        </p>
      </div>
    `,
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: "Edit",
      cancelButtonText: "Close",
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow",
        denyButton:
          "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow",
        cancelButton:
          "bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow",
        actions: "flex gap-2 justify-center",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(sub);
      } else if (result.isDenied) {
        setOpenSubcategoryModal(true);
        setCurrentCategory(category);
        setEditingSubCategory(sub);
      }
    });
  };

  const confirmDelete = (sub) => {
    Alert.delete(
      `This action will permanently delete sub-category "${sub.name}".`,
      sub.code,
    ).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteSubCategory({
            categoryId: currentCategory._id,
            code: sub.code,
          }),
        ).then((data) => {
          if (data.meta.requestStatus === "fulfilled") {
            Alert.success(
              "Deleted",
              "Sub-category deleted successfully",
              "number",
            );
            dispatch(getAllCategories());
          } else {
            Alert.error(
              "Error",
              data.payload || "Failed to delete sub-category",
            );
          }
        });
      }
    });
  };

  const handleSubmitCategory = (data) => {
    if (currentCategory) {
      const updatedData = {
        ...currentCategory,
        ...data,
        rangeStart: Number(data.rangeStart),
        rangeEnd: Number(data.rangeEnd),
      };
      dispatch(updateCategory(updatedData)).then((data) => {
        if (data.meta.requestStatus === "fulfilled") {
          setOpenModal(false);
          Alert.success("success", "Category updated successfully");
        }
      });
    } else {
      const formData = {
        name: data.name,
        rangeStart: Number(data.rangeStart),
        rangeEnd: Number(data.rangeEnd),
      };
      dispatch(insertCategory(formData)).then((data) => {
        if (data.meta.requestStatus === "fulfilled") {
          setOpenModal(false);
          Alert.success("success", "Category saved successfully");
        }
      });
    }
  };

  const handleSubmitSubCategory = (data) => {
    if (data.isEdit) {
      dispatch(
        updateSubCategory({
          categoryId: data.categoryId,
          originalCode: data.originalCode,
          updatedSub: { name: data.name, code: Number(data.code) },
        }),
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setOpenSubcategoryModal(false);
          Alert.success("Success", "Sub-category updated successfully");
          dispatch(getAllCategories());
        } else {
          Alert.error("Error", res.payload || "Failed to update sub-category");
        }
      });
    } else {
      dispatch(insertSubCategory(data)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setOpenSubcategoryModal(false);
          Alert.success("Success", "Sub-category added successfully");
          dispatch(getAllCategories());
        } else {
          Alert.error("Error", res.payload || "Failed to add sub-category");
        }
      });
    }
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
            Categories
          </Typography>
        </Breadcrumbs>

        {/* Title + Add Button */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Categories
          </Typography>

          <button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded shadow transition-all cursor-pointer"
            onClick={() => {
              setCurrentCategory(null);
              setOpenModal(true);
            }}
          >
            <FaPlus />
            Add Category
          </button>
        </Box>
      </Box>

      <CustomDataTable data={categories} columns={columns} />

      <AddFrom
        open={openModal}
        onClose={() => setOpenModal(false)}
        category={currentCategory}
        onSubmit={handleSubmitCategory}
      />

      <AddSubCategoryForm
        open={openSubcategoryModal}
        onClose={() => {
          setOpenSubcategoryModal(false);
          setEditingSubCategory(null);
        }}
        category={currentCategory}
        subCategory={editingSubCategory}
        onSubmit={handleSubmitSubCategory}
      />
    </div>
  );
};

// category add edit form modal
const AddFrom = ({ open, onClose, category, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    rangeStart: "",
    rangeEnd: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        rangeStart: category.rangeStart || "",
        rangeEnd: category.rangeEnd || "",
      });
    } else {
      setFormData({
        name: "",
        rangeStart: "",
        rangeEnd: "",
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (category) {
      onSubmit(formData);
    } else {
      onSubmit(formData);
    }

    setFormData({
      name: "",
      rangeStart: "",
      rangeEnd: "",
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" textAlign="center" mb={3}>
          {category ? "Update Category" : "Add New Category"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              name="name"
              label="Category Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              type="number"
              name="rangeStart"
              label="Start Range"
              value={formData.rangeStart}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              type="number"
              name="rangeEnd"
              label="End Range"
              value={formData.rangeEnd}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded uppercase"
            >
              {category ? "Update Category" : "Add Category"}
            </button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

const AddSubCategoryForm = ({
  open,
  onClose,
  category,
  subCategory,
  onSubmit,
}) => {
  const [errors, setErrors] = useState({ code: "" });
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  // Prefill form when editing
  useEffect(() => {
    if (subCategory) {
      setFormData({
        name: subCategory.name,
        code: subCategory.code,
      });
    } else {
      setFormData({ name: "", code: "" });
    }
    setErrors({ code: "" });
  }, [subCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "code") {
      if (debounceTimer) clearTimeout(debounceTimer);

      const timer = setTimeout(() => {
        const existingSub = category?.subcategories?.find(
          (sub) => sub.code === Number(value) && sub.code !== subCategory?.code,
        );

        if (existingSub) {
          setErrors({ code: `Sub-category code ${value} is already used` });
        } else if (value > category.rangeEnd || value < category.rangeStart) {
          setErrors({
            code: `Code must be between ${category.rangeStart} and ${category.rangeEnd}`,
          });
        } else {
          setErrors({ code: "" });
        }
      }, 200);

      setDebounceTimer(timer);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errors.code) return;

    onSubmit({
      ...formData,
      categoryId: category._id,
      isEdit: !!subCategory,
      originalCode: subCategory?.code, // send original code for update
    });

    setFormData({ name: "", code: "" });
    setErrors({ code: "" });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" textAlign="center" mb={3}>
          {subCategory ? "Update Subcategory" : "Add Subcategory"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              name="name"
              label="Subcategory Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              name="code"
              label={`Subcategory Code (${category?.rangeStart} - ${category?.rangeEnd})`}
              value={formData.code}
              onChange={handleChange}
              required
              error={!!errors.code}
              helperText={errors.code}
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded uppercase cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!!errors.code}
            >
              {subCategory ? "Update Subcategory" : "Add Subcategory"}
            </button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default Categories;
