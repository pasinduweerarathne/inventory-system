import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/api/axios";

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/products/all");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to fetch products",
      );
    }
  },
);

export const insertProduct = createAsyncThunk(
  "products/insertProduct",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/products/create", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to insert product",
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/products/update/${data.prodId}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update product",
      );
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/products/delete/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to delete product",
      );
    }
  },
);
