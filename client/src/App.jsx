import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "@/layouts/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Categories from "@/pages/Categories";
import Products from "./pages/Products";

function PrivateRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </Layout>
          }
        />
        <Route
          path="/categories"
          element={
            <Layout>
              <PrivateRoute>
                <Categories />
              </PrivateRoute>
            </Layout>
          }
        />
        <Route
          path="/products"
          element={
            <Layout>
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
