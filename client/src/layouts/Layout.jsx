import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      <div className="flex-1 bg-gray-100 p-6 overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
