let baseUrl = 'http://192.168.0.12:9130/';

//   "proxy": {
// "/api": {
//   "target": "http://192.168.0.12:9130/",
//   "changeOrigin": true,
//   "pathRewrite": {"^/api" : "/"},
//   "secure": false
//  },

if (process.env.NODE_ENV === 'production') {
  // 测试部使用的生产环境，上线时改为发布环境
  baseUrl = 'http://api.huixuebang.com/';
  // baseUrl = 'http://192.168.0.12:9130/'
} else {
  // 开发环境
  // baseUrl = 'http://api.huixuebang.com/'
  // baseUrl = 'http://192.168.0.38:9130/'
  baseUrl = 'http://192.168.0.12:9130/';
  // baseUrl = '/api/';
}

export const urls = {
  baseUrl: baseUrl,

  // 登录
  LOGIN: 'org-backend/student/paper/login'
};

// 不需要token的请求
export const noTokenReq = [urls.LOGIN];
