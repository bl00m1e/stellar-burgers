import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TOrderByNumberState = {
  order: TOrder | null;
  isLoading: boolean;
  notFound: boolean;
};

const initialState: TOrderByNumberState = {
  order: null,
  isLoading: false,
  notFound: false
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderByNumber/fetch',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    return res.orders[0] ?? null;
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
        state.notFound = false;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        state.notFound = !action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.isLoading = false;
        state.notFound = true;
      });
  }
});

export const selectOrderByNumber = (state: RootState) =>
  state.orderByNumber.order;
export const selectOrderByNumberNotFound = (state: RootState) =>
  state.orderByNumber.notFound;

export default orderByNumberSlice.reducer;
