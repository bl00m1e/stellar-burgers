const buildWsBase = () => {
  const apiUrl = process.env.BURGER_API_URL || '';
  return apiUrl.replace(/^http/, 'ws').replace(/\/api\/?$/, '');
};

export const FEED_WS_URL = `${buildWsBase()}/orders/all`;

export const getUserOrdersWsUrl = (accessToken: string) =>
  `${buildWsBase()}/orders?token=${accessToken}`;
