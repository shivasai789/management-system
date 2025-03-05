import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  overviewData: null,
};

export const getOverviewData = createAsyncThunk(
  "/analytics/overview",
  async ( _,{rejectWithValue}) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/analytics/overview`
      );

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Analytics error" });
    }
  }
);

const authSlice = createSlice({
  name: "overviewData",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOverviewData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOverviewData.fulfilled, (state, action) => {
        console.log(action,"dsjafhdkfh")
        state.isLoading = false;
        state.overviewData = !action.payload.success ? null : action.payload.overview;
      })
      .addCase(getOverviewData.rejected, (state) => {
        state.isLoading = false;
        state.overviewData = null;
      })
  },
});

export default authSlice.reducer;