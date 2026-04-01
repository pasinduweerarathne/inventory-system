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
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/categories/create", data);
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
  async (data, { rejectWithValue }) => {
    console.log(data);
    try {
      const res = await API.patch(`/categories/update/${data._id}`, data);
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

export const insertSubCategory = createAsyncThunk(
  "categories/insertSubCategory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post(
        `/categories/add-subcategory/${data.categoryId}`,
        data,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to insert sub-category",
      );
    }
  },
);

export const updateSubCategory = createAsyncThunk(
  "categories/updateSubCategory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.patch(
        `/categories/update-subcategory/${data.categoryId}/${data.originalCode}`,
        data.updatedSub,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to update sub-category",
      );
    }
  },
);

export const deleteSubCategory = createAsyncThunk(
  "categories/deleteSubCategory",
  async ({ categoryId, code }, { rejectWithValue }) => {
    try {
      const res = await API.delete(
        `/categories/remove-subcategory/${categoryId}/${code}`,
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to delete sub-category",
      );
    }
  },
);
