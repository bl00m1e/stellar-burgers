import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedOrders,
  wsFeedConnect,
  wsFeedDisconnect
} from '../../services/slices/feed-slice';
import { FEED_WS_URL } from '../../utils/ws-url';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);

  useEffect(() => {
    dispatch(wsFeedConnect(FEED_WS_URL));
    return () => {
      dispatch(wsFeedDisconnect());
    };
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(wsFeedConnect(FEED_WS_URL))}
    />
  );
};
