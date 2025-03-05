import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  orders: null,
};

export const getOrders = createAsyncThunk(
  "/order/get-order",
  async ({ status, workstation }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/order?status=${status}&workstation=${workstation}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Getting Orders failed");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Getting Orders error" });
    }
  }
);

export const editOrder = createAsyncThunk(
  "/order/edit-order",
  async ({id,status}, { rejectWithValue }) => {
    // console.log(id,status)
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/order/${id}?status=${status}`
      );

      // console.log(response)

      if (!response.data.success) {
        throw new Error(response.data.message || "Editing Order failed");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Editing Order error" });
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "/order/delete-order",
  async ({id,token}, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/order/${id}`,
        {
          headers: {
            Authorization: `${token}`,
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Deleting Orders failed");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Deleting Orders error" });
    }
  }
);

export const createOrders = createAsyncThunk(
  "/order/create-order",
  async ({ formdata, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}api/order/`,
        formdata,
        {
          headers: {
            Authorization: `${token}`,
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Creating Order failed");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Creating Order error" });
    }
  }
);

const authSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.success ? action.payload.orders : null;
      })
      .addCase(getOrders.rejected, (state) => {
        state.isLoading = false;
        state.orders = null;
      })
      .addCase(editOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
            state.orders = state.orders?.map((order) =>
                order._id === action.payload.order._id
                    ? { ...order, ...action.payload.order, endDate: action.payload.order.endDate ?? order.endDate }
                    : order
            );
        }
    })
    
      .addCase(editOrder.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.orders = state.orders?.filter((order) => order.id !== action.payload.orderId);
        }
      })
      .addCase(deleteOrder.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.orders = [...(state.orders || []), action.payload.order];
        }
      })
      .addCase(createOrders.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
