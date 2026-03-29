import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(insertCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(insertCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
