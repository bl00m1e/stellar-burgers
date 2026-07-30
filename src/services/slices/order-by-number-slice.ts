import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderByNumberState = {
  order: TOrder | null;
  isLoading: boolean;
};

const initialState: TOrderByNumberState = {
  order: null,
  isLoading: false
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderByNumber/fetch',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0];
  }
);

const orderByNumberSlice = createSlice({
  name: 'orderByNumber',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.order = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const selectOrderByNumber = (state: RootState) =>
  state.orderByNumber.order;

export default orderByNumberSlice.reducer;
