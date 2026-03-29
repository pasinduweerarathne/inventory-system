import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
