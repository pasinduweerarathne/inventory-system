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
