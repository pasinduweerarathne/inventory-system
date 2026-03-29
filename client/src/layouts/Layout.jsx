import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      <div className="flex-1 p-6 overflow-auto bg-green-50">{children}</div>
    </div>
  );
};

export default Layout;
