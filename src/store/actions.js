export const setUserInfo = userInfo => ({
  type: 'SET_USERINFO',
  userInfo
});

export const setRoutes = currentRoute => ({
  type: 'SET_ROUTES',
  currentRoute
});

export const setTopic = topic => ({
  type: 'SET_TOPIC',
  topic
});
