import React, { useState, useEffect, useMemo } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Alert from "@/components/Alerts";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCategory,
  getAllCategories,
  insertCategory,
  updateCategory,
} from "../store/functions/categories";

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.categories,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const filteredCategories = useMemo(
    () =>
      categories?.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [categories, searchTerm],
  );

  const totalPages = Math.ceil(filteredCategories?.length / itemsPerPage);
  const paginatedCategories = filteredCategories?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatName = (value) => {
    return value
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const handleAddCategory = async () => {
    const result = await Swal.fire({
      title: "Enter Category Name",
      input: "text",
      inputPlaceholder: "e.g. Jackets",
      showCancelButton: true,
      confirmButtonText: "Add Category",
      confirmButtonColor: "#16a34a",
      preConfirm: (value) => {
        if (!value || value.trim() === "") {
          return Swal.showValidationMessage("Category name is required");
        }

        const formatted = formatName(value.trim());

        const exists = categories.some(
          (c) => c.name.toLowerCase() === formatted.toLowerCase(),
        );

        if (exists) {
          return Swal.showValidationMessage("This category already exists!");
        }

        return formatted;
      },
    });

    if (result.isConfirmed) {
      const newCategory = { name: result.value };
      dispatch(insertCategory(newCategory));

      Alert.success("Added!", `${newCategory.name} category added`);
    }
  };

  const handleEditCategory = async (category) => {
    const result = await Swal.fire({
      title: "Edit Category",
      input: "text",
      inputValue: category.name,
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#16a34a",
      preConfirm: (value) => {
        if (!value || value.trim() === "") {
          return Swal.showValidationMessage("Category name is required");
        }

        const formatted = formatName(value.trim());

        const exists = categories.some(
          (c) =>
            c.id !== category.id &&
            c.name.toLowerCase() === formatted.toLowerCase(),
        );

        if (exists) {
          return Swal.showValidationMessage("This category already exists!");
        }

        return formatted;
      },
    });

    if (result.isConfirmed) {
      dispatch(updateCategory({ id: category._id, name: result.value }));

      Alert.success("Updated!", "Category updated successfully");
    }
  };

  const handleDeleteCategory = async (category) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${category.name}" category?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      dispatch(deleteCategory({ id: category._id }));

      Alert.success(
        "Deleted!",
        `Category "${category.name}" has been deleted.`,
      );
    }
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-green-50">
      {/* Header */}
      <h2 className="text-3xl font-bold text-green-700">Categories</h2>

      {/* Search + Add */}
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-green-700" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-3 py-2 border border-green-300 rounded bg-green-100 text-green-900 focus:ring-2 focus:ring-green-400 outline-none"
          />
        </div>

        <button
          onClick={handleAddCategory}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-green-300 shadow">
        <table className="w-full">
          <thead className="bg-green-200 text-green-900">
            <tr>
              <th className="p-3 text-left border-r border-green-300">
                Category Name
              </th>
              <th className="p-3 text-left border-r border-green-300">
                Is Active
              </th>
              <th className="p-3 text-left w-32">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCategories?.map((c) => (
              <tr
                key={c._id}
                className="border-t border-green-200 hover:bg-green-100 transition"
              >
                <td className="p-3 font-medium border-r border-green-200">
                  {c.name}
                </td>
                <td className="p-3 font-medium border-r border-green-200">
                  {c.isActive ? "Active" : "Inactive"}
                </td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => handleEditCategory(c)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(c)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}

            {paginatedCategories?.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-4 text-green-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border border-green-400 rounded text-green-700 hover:bg-green-100 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-green-600 text-white border-green-600"
                : "border-green-400 text-green-700 hover:bg-green-100"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border border-green-400 rounded text-green-700 hover:bg-green-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Categories;
