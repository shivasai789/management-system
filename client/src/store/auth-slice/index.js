import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
};

export const loginUserAction = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/auth/login`,
        formData
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Login error" });
    }
  }
);

export const checkAuthenticate = createAsyncThunk(
  "/auth/check-auth",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/auth/check-auth`,
        {
          headers: {
            Authorization: `${token}`,
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Authentication error" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // eslint-disable-next-line no-unused-vars
    setUser: (state, action) => {},
    resetTokenAndCredentials: (state) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.user = null;
        state.token = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUserAction.fulfilled, (state, action) => {
        // console.log(action)
        state.isLoading = false;
        state.user = !action.payload.success ? null : action.payload.user;
        state.isAuthenticated = action.payload.success;
        state.token = action.payload.token;
        sessionStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addCase(loginUserAction.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(checkAuthenticate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthenticate.fulfilled, (state, action) => {
        // console.log(action)
        state.isLoading = false;
        state.user = !action.payload.success ? null : action.payload.user;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuthenticate.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
  },
});

export const { setUser,resetTokenAndCredentials } = authSlice.actions;
export default authSlice.reducer;