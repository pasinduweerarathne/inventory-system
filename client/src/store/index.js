import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice.js";
import categoryReducer from "@/store/slices/categorySlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
  },
});
