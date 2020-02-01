/*
 * @Author:      Arya
 * @DateTime:    2019-12-30
 * @Description: 公共方法
 */

import http from '@utils/http';
import { urls } from '@utils/api';
import { createHashHistory } from 'history'; // 是hash路由 history路由 自己根据需求来定
const history = createHashHistory();
import $ from 'jquery';
import store from '../store/index.js';
import { setUserInfo } from '@store/actions';
export default {
  /* 退出登录 */
  loginOut() {
    sessionStorage.removeItem('sToken');
    localStorage.removeItem('userInfo');
    store.dispatch(setUserInfo(null));
    history.push('/login');
  },

  /* 处理文件名 */
  dealUrl(url) {
    let newUrl = decodeURI(url);
    let t = newUrl.split('?')[0].split('/');
    let n = t[t.length - 1].split('_');
    return n[n.length - 1];
  }
};
