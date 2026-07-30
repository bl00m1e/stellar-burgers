import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUserOrders,
  wsUserOrdersConnect,
  wsUserOrdersDisconnect
} from '../../services/slices/user-orders-slice';
import { getUserOrdersWsUrl } from '../../utils/ws-url';
import { getCookie } from '../../utils/cookie';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    const accessToken = (getCookie('accessToken') || '').replace('Bearer ', '');
    dispatch(wsUserOrdersConnect(getUserOrdersWsUrl(accessToken)));
    return () => {
      dispatch(wsUserOrdersDisconnect());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
