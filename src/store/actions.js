// action也是函数
export function setUserInfo(data) {
  return (dispatch, getState) => {
    console.log(111111111111111111, data);
    dispatch({ type: 'SET_USER_INFO', data: data });
  };
}
