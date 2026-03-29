import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaTshirt,
  FaBoxOpen,
  FaChartPie,
  FaSignOutAlt,
  FaLeaf,
  FaArrowCircleLeft,
  FaArrowCircleRight,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: FaHome, path: "/dashboard" },
  { name: "Categories", icon: FaTshirt, path: "/categories" },
  { name: "Products", icon: FaBoxOpen, path: "/products" },
  { name: "Reports", icon: FaChartPie, path: "/reports" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <div
      className={`bg-green-700 text-white h-screen flex flex-col transition-all duration-300 ${
        collapsed ? "w-10" : "w-64"
      }`}
    >
      {/* Logo + Collapse Button */}
      <div className="relative flex items-center justify-center mb-8 h-16">
        {/* Logo */}
        {!collapsed && (
          <span className="flex items-center text-2xl font-bold transition-all duration-300">
            <FaLeaf className="text-green-300" size={24} />
            Peach.<span className="text-green-300">Clothing</span>
          </span>
        )}

        {/* Collapse Button */}
        <button
          onClick={toggleCollapsed}
          className="absolute -right-4 top-[55%] transform -translate-y-1/2 bg-green-500 hover:bg-green-700 text-white rounded-full p-1 shadow-lg duration-300 transition-colors cursor-pointer"
        >
          {collapsed ? (
            <FaArrowCircleRight size={24} />
          ) : (
            <FaArrowCircleLeft size={24} />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col flex-1 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-2 rounded hover:bg-green-600 transition-colors w-full ${
                  collapsed ? "justify-center" : "gap-3"
                } ${isActive ? "bg-green-800" : ""}`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        className={`flex items-center p-2 rounded hover:bg-green-600 mt-auto w-full ${
          collapsed ? "justify-center" : "gap-3"
        }`}
      >
        <FaSignOutAlt size={20} />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;
