import React, { useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";

const products = [
  {
    _id: "1",
    name: "Floral Summer Dress",
    category: "Dresses",
    price: 3500,
    stock: 20,
    isActive: true,
  },
  {
    _id: "2",
    name: "Casual T-Shirt",
    category: "T-Shirts",
    price: 1500,
    stock: 50,
    isActive: true,
  },
  {
    _id: "3",
    name: "Denim Jeans",
    category: "Jeans",
    price: 4000,
    stock: 15,
    isActive: false,
  },

  // 🔥 Low stock products
  {
    _id: "4",
    name: "Silk Saree",
    category: "Sarees",
    price: 8500,
    stock: 3,
    isActive: true,
  },
  {
    _id: "5",
    name: "Office Blazer",
    category: "Blazers",
    price: 6500,
    stock: 2,
    isActive: true,
  },
  {
    _id: "6",
    name: "Yoga Leggings",
    category: "Leggings",
    price: 2200,
    stock: 5,
    isActive: true,
  },
  {
    _id: "7",
    name: "Crop Top",
    category: "Tops",
    price: 1800,
    stock: 4,
    isActive: true,
  },
  {
    _id: "8",
    name: "Winter Jacket",
    category: "Jackets",
    price: 9500,
    stock: 1,
    isActive: false,
  },
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const LOW_STOCK_LIMIT = 5;

  const lowStockProducts = products.filter((p) => p.stock <= LOW_STOCK_LIMIT);

  const handleAddProduct = async () => {};

  return (
    <div className="p-6 space-y-6 min-h-screen bg-green-50">
      {/* Header */}
      <h2 className="text-3xl font-bold text-green-700">PRODUCTS</h2>

      {/* Search + Add */}
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-green-700" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-3 py-2 border border-green-300 rounded bg-green-100 text-green-900 focus:ring-2 focus:ring-green-400 outline-none"
          />
        </div>

        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition"
        >
          <FaPlus />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-green-300 shadow">
        <table className="w-full">
          <thead className="bg-green-200 text-green-900">
            <tr>
              <th className="p-3 text-left border-r border-green-300">
                Product Name
              </th>
              <th className="p-3 text-left border-r border-green-300">
                Category
              </th>
              <th className="p-3 text-left border-r border-green-300">
                Price (LKR)
              </th>
              <th className="p-3 text-left border-r border-green-300">Stock</th>
              <th className="p-3 text-left border-r border-green-300">
                Status
              </th>
              <th className="p-3 text-center w-32">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p._id}
                className={`border-t transition
                ${
                  p.stock <= LOW_STOCK_LIMIT
                    ? "bg-red-100 hover:bg-red-200 border-red-300"
                    : "border-green-200 hover:bg-green-100"
                }`}
              >
                <td className="p-3 font-medium border-r border-green-200">
                  {p.name}
                </td>

                <td className="p-3 border-r border-green-200">{p.category}</td>

                <td className="p-3 border-r border-green-200">
                  Rs. {p.price.toLocaleString()}
                </td>

                <td className="p-3 border-r border-green-200">{p.stock}</td>

                <td className="p-3 border-r border-green-200">
                  {p.isActive ? "Active" : "Inactive"}
                </td>

                <td className="p-3 flex justify-center gap-3">
                  <button className="text-green-600 hover:text-green-800 cursor-pointer">
                    <FaEdit size={20} />
                  </button>

                  <button className="text-red-500 hover:text-red-700 cursor-pointer">
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-green-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-red-300 shadow">
        <h2 className="bg-red-200 text-red-900 px-4 py-2 font-semibold">
          ⚠️ Low Stock Products
        </h2>

        <table className="w-full">
          <thead className="bg-red-100 text-red-900">
            <tr>
              <th className="p-3 text-left border-r border-red-300">
                Product Name
              </th>
              <th className="p-3 text-left border-r border-red-300">
                Category
              </th>
              <th className="p-3 text-left border-r border-red-300">Stock</th>
              <th className="p-3 text-left border-r border-red-300">Status</th>
            </tr>
          </thead>

          <tbody>
            {lowStockProducts.map((p) => (
              <tr
                key={p._id}
                className="border-t border-red-200 hover:bg-red-50 transition"
              >
                <td className="p-3 font-medium border-r border-red-200">
                  {p.name}
                </td>

                <td className="p-3 border-r border-red-200">{p.category}</td>

                <td className="p-3 border-r border-red-200 font-bold text-red-600">
                  {p.stock}
                </td>

                <td className="p-3 border-r border-red-200">
                  {p.isActive ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}

            {lowStockProducts.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-red-400">
                  No low stock products 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
