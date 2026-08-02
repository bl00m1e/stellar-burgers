import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredients-slice';
import burgerConstructorReducer from './slices/burger-constructor-slice';
import orderReducer from './slices/order-slice';
import orderByNumberReducer from './slices/order-by-number-slice';
import feedReducer, {
  wsFeedClose,
  wsFeedConnect,
  wsFeedDisconnect,
  wsFeedError,
  wsFeedMessage,
  wsFeedOpen
} from './slices/feed-slice';
import userOrdersReducer from './slices/user-orders-slice';
import userReducer from './slices/user-slice';

import { socketMiddleware } from './middleware/socket-middleware';

const feedSocketMiddleware = socketMiddleware({
  connect: wsFeedConnect,
  disconnect: wsFeedDisconnect,
  onOpen: wsFeedOpen,
  onClose: wsFeedClose,
  onError: wsFeedError,
  onMessage: wsFeedMessage
});

const rootReducer = {
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  order: orderReducer,
  orderByNumber: orderByNumberReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer,
  user: userReducer
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedSocketMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
