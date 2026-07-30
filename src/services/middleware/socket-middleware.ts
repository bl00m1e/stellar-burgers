import { Middleware } from '@reduxjs/toolkit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TWsActionTypes = {
  connect: any;
  disconnect: any;
  onOpen: any;
  onClose: any;
  onError: any;
  onMessage: any;
};

// Универсальный middleware — тип экшенов заранее неизвестен,
// поэтому здесь осознанно используется any (фабрика для разных сокетов).
export const socketMiddleware = (wsActions: TWsActionTypes): Middleware => {
  return (store) => {
    let socket: WebSocket | null = null;

    return (next) => (action: any) => {
      const { dispatch } = store;
      const { connect, disconnect, onOpen, onClose, onError, onMessage } =
        wsActions;

      if (connect.match(action)) {
        socket = new WebSocket(action.payload);
      }

      if (socket) {
        socket.onopen = () => {
          dispatch(onOpen());
        };

        socket.onerror = () => {
          dispatch(onError('Ошибка соединения с сервером'));
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.success === false) {
            dispatch(onError(data.message || 'Ошибка сервера'));
            return;
          }
          dispatch(onMessage(data));
        };

        socket.onclose = () => {
          dispatch(onClose());
        };
      }

      if (disconnect.match(action)) {
        socket?.close();
        socket = null;
      }

      next(action);
    };
  };
};
