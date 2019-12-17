import axios from 'axios';
import qs from 'qs';
// import * as apiUrl from './ApiURL';
// import {notification} from 'antd';
import { message } from 'antd';
import { urls, noTokenReq } from './api';
import common from '@utils/common';
// noTokenReq
// 创建axios实例
// const service = axios.create({
//   baseURL: urls.baseUrl, // api的base_url  Vue项目可以根据 process.env.BASE_API，React可以在这里定义
//   timeout: 50000, // 请求超时时间
//   withCredentials: true, // 跨域携带cookie
//   xsrfCookieName: 'xsrf-token' //当创建实例的时候配置默认配置
// });

// 字符串格式化
String.prototype.format = function() {
  // eslint-disable-line
  let args = arguments;
  return this.replace(/\{(\d+)\}/g, function(m, i) {
    return args[i];
  });
};

const service = axios.create({
  baseURL: urls.baseUrl,
  timeout: 30000
});
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['X-Auth-Token'] = '';
/* 请求拦截 */
service.interceptors.request.use(
  function(config) {
    // 需要带token的接口 请求带上token
    if (noTokenReq.indexOf(config.url) == -1) {
      // 验证浏览器localStorage缓存中是否存在token
      let sToken = sessionStorage.getItem('sToken');
      config.headers.common['X-Auth-Token'] = sToken;

      // return !!sToken;
    } else {
      config.headers.common['X-Auth-Token'] = '';
      // return true;
    }
    // config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    return config;
  },
  function(error) {
    return error;
  }
);

/* 响应拦截 */
service.interceptors.response.use(
  response => {
    /**
     * 判断服务器请求是否成功
     * @method if
     * @param  {[type]} response [description]
     * @return {[type]}          [description]
     */
    if (response.status !== 200) {
      return Promise.reject(new Error('网络异常，请稍后重试'));
    }
    const res = response.data;
    // 正常返回
    if (res.code === '000000') {
      return res;
    } else if (res.code === '000301') {
      common.loginOut();

      return Promise.reject(res.message);
    } else {
      return Promise.reject(res.message);
    }
  },
  error => {
    return Promise.reject(error);
  }
);

/* ********************* all request methods ************************** */
const http = {
  get: '',
  post: '',
  postJson: '',
  put: '',
  delete: ''
};

/* ********************* 封装get请求 ************************** */

http.get = function(url, data) {
  let params = qs.stringify(data);
  url =
    arguments.length > 2
      ? url.format(...[].slice.call(arguments).slice(2))
      : url;
  return service
    .get(url, params)
    .then(res => {
      return res;
    })
    .catch(error => {
      message.error(error);
    });
};

/* ********************* 封装post请求 ************************** */

http.post = function(url, data) {
  let params = qs.stringify(data);
  url =
    arguments.length > 2
      ? url.format(...[].slice.call(arguments).slice(2))
      : url;

  return service
    .post(url, params)
    .then(res => {
      return res;
    })
    .catch(error => {
      message.error(error);
    });
};

/* ********************* 封装post请求 json格式 ************************** */

http.postJson = function(url, data) {
  let params = data;
  url =
    arguments.length > 2
      ? url.format(...[].slice.call(arguments).slice(2))
      : url;

  return service
    .post(url, params)
    .then(res => {
      return res;
    })
    .catch(error => {
      message.error(error);
    });
};

/* ********************* 封装put请求 ************************** */

http.put = function(url, data) {
  let params = data;
  url =
    arguments.length > 2
      ? url.format(...[].slice.call(arguments).slice(2))
      : url;

  return service
    .put(url, params)
    .then(res => {
      return res;
    })
    .catch(error => {
      message.error(error);
    });
};

/* ********************* 封装delete请求 ************************** */

http.delete = function(url, data) {
  let params = data;
  url =
    arguments.length > 2
      ? url.format(...[].slice.call(arguments).slice(2))
      : url;

  return service
    .delete(url, params)
    .then(res => {
      return res;
    })
    .catch(error => {
      message.error(error);
    });
};

// axios.defaults.baseURL = urls.baseUrl;

// axios.defaults.timeout = 120000;
// axios.defaults.headers.common['X-Client-Type'] = 'hxb';
// axios.defaults.headers.common['X-Client-Version'] = '1.0.0';
// axios.defaults.paramsSerializer = function(params) {
//   return qs.stringify(params, { arrayFormat: 'repeat' });
// };

export default http;
