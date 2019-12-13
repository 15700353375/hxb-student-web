let baseUrl = 'http://192.168.0.12:9130/';

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
  LOGIN: 'org-backend1/student/paper/login',

  // 获取验证码
  GETCODE: 'user-api/sendMsg/',

  // 更改手机号
  MOBILE_BIND: 'org-backend1/student/paper/mobile',

  // 注意事项确认
  NOTES_ACK: 'org-backend1/student/paper/notes/ack',

  // 确认手机号
  MOBILE_ACK: 'org-backend1/student/paper/mobile/ack'
};

// 不需要token的请求
export const noTokenReq = [urls.LOGIN];
