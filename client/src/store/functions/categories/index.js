import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "@/api/axios";

export const getAllCategories = createAsyncThunk(
  "categories/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/categories/get-all");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to fetch categories",
      );
    }
  },
);

export const insertCategory = createAsyncThunk(
  "categories/insertCategory",
  async ({ name }, { rejectWithValue }) => {
    try {
      const res = await API.post("/categories/create", { name });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to insert category",
      );
    }
  },
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/categories/update/${id}`, { name });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to update category",
      );
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/categories/delete/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to delete category",
      );
    }
  },
);
