import React from "react";
import {
  FaBoxOpen,
  FaTshirt,
  FaExclamationTriangle,
  FaChartPie,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
);

const Dashboard = () => {
  // Sample data
  const totalProducts = 124;
  const totalCategories = 5;
  const totalStock = 980;
  const lowStock = 12;

  const stockByCategory = {
    labels: ["Dresses", "Tops", "Skirts", "Pants", "Accessories"],
    datasets: [
      {
        data: [300, 200, 150, 180, 150],
        backgroundColor: [
          "#F87171",
          "#FBBF24",
          "#34D399",
          "#60A5FA",
          "#A78BFA",
        ],
      },
    ],
  };

  const monthlySales = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales",
        data: [120, 190, 150, 200, 250, 300],
        borderColor: "#60A5FA",
        backgroundColor: "rgba(96, 165, 250, 0.2)",
        tension: 0.4, // smooth curves
        fill: true,
      },
    ],
  };

  const recentProducts = [
    { name: "Red Dress", category: "Dresses", stock: 20 },
    { name: "Floral Top", category: "Tops", stock: 5 },
    { name: "Pleated Skirt", category: "Skirts", stock: 12 },
    { name: "Blue Pants", category: "Pants", stock: 7 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-600 text-white p-4 rounded shadow flex items-center gap-4">
          <FaBoxOpen size={32} />
          <div>
            <p className="text-sm">Total Products</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded shadow flex items-center gap-4">
          <FaTshirt size={32} />
          <div>
            <p className="text-sm">Categories</p>
            <p className="text-2xl font-bold">{totalCategories}</p>
          </div>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded shadow flex items-center gap-4">
          <FaChartPie size={32} />
          <div>
            <p className="text-sm">Total Stock</p>
            <p className="text-2xl font-bold">{totalStock}</p>
          </div>
        </div>
        <div className="bg-red-500 text-white p-4 rounded shadow flex items-center gap-4">
          <FaExclamationTriangle size={32} />
          <div>
            <p className="text-sm">Low Stock</p>
            <p className="text-2xl font-bold">{lowStock}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Stock by Category</h3>
          <Pie data={stockByCategory} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-2">Monthly Sales</h3>
          <Line data={monthlySales} />
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-2">Recent Products</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.map((p, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.category}</td>
                <td className={`p-2 ${p.stock < 10 ? "text-red-500" : ""}`}>
                  {p.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
