import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { TOrder } from '@utils-types';

type TUserOrdersState = {
  orders: TOrder[];
  isConnected: boolean;
  error: string | null;
};

const initialState: TUserOrdersState = {
  orders: [],
  isConnected: false,
  error: null
};

type TUserOrdersWsMessage = {
  success: boolean;
  orders: TOrder[];
};

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    wsUserOrdersConnect: (state, _action: PayloadAction<string>) => {
      state.error = null;
    },
    wsUserOrdersDisconnect: (state) => {
      state.isConnected = false;
    },
    wsUserOrdersOpen: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    wsUserOrdersClose: (state) => {
      state.isConnected = false;
    },
    wsUserOrdersError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    wsUserOrdersMessage: (
      state,
      action: PayloadAction<TUserOrdersWsMessage>
    ) => {
      state.orders = action.payload.orders;
    }
  }
});

export const {
  wsUserOrdersConnect,
  wsUserOrdersDisconnect,
  wsUserOrdersOpen,
  wsUserOrdersClose,
  wsUserOrdersError,
  wsUserOrdersMessage
} = userOrdersSlice.actions;

export const selectUserOrders = (state: RootState) => state.userOrders.orders;

export default userOrdersSlice.reducer;
