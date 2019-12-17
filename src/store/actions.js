// action也是函数
// export function setUserInfo(data) {
//   return (dispatch, getState) => {
//     console.log(111111111111111111, data);
//     dispatch({ type: 'SET_USER_INFO', data: data });
//   };
// }

export const VisibilityFilters = {
  SHOW_LOGIN: 'SHOW_LOGIN',
  SHOW_MOBILE: 'SHOW_MOBILE',
  SHOW_BIND_MOBILE: 'SHOW_ACTIVE',
  SHOW_ATTENTION: 'SHOW_ATTENTION'
};

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
