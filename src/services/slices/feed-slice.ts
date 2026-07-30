import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  error: null
};

type TFeedWsMessage = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsFeedConnect: (state, _action: PayloadAction<string>) => {
      state.error = null;
    },
    wsFeedDisconnect: (state) => {
      state.isConnected = false;
    },
    wsFeedOpen: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    wsFeedClose: (state) => {
      state.isConnected = false;
    },
    wsFeedError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    wsFeedMessage: (state, action: PayloadAction<TFeedWsMessage>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  }
});

export const {
  wsFeedConnect,
  wsFeedDisconnect,
  wsFeedOpen,
  wsFeedClose,
  wsFeedError,
  wsFeedMessage
} = feedSlice.actions;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotal = (state: RootState) => state.feed.total;
export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;

export default feedSlice.reducer;
