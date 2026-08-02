import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TUserOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
};

const initialState: TUserOrdersState = {
  orders: [],
  isLoading: false
};

export const fetchUserOrders = createAsyncThunk('userOrders/fetch', async () =>
  getOrdersApi()
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const selectUserOrders = (state: RootState) => state.userOrders.orders;

export default userOrdersSlice.reducer;
