import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import App from './App';
import * as serviceWorker from './serviceWorker';
import moment from 'moment';
window.Moment = moment;
// 第二个工具是connect，稍后会作介绍
import { Provider } from 'react-redux';
// 引入创建好的store实例
import store from './store/index.js';

ReactDOM.render(
  <div className="app">
    <Provider store={store}>
      <App />
    </Provider>
  </div>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
