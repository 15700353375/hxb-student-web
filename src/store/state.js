/*
 * @Author:      Arya
 * @DateTime:    2019-12-30
 * @Description: redux basic state
 */

let userInfo = localStorage.getItem('userInfo');
let topic = localStorage.getItem('topic');
import { createHashHistory } from 'history'; // 是hash路由 history路由 自己根据需求来定
const history = createHashHistory();
export default {
  userInfo: JSON.parse(userInfo),
  currentRoute: history.location,
  topic: JSON.parse(topic)
};
