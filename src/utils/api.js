let baseUrl = 'http://192.168.0.12:9130/';

if (process.env.NODE_ENV === 'production') {
  // 测试部使用的生产环境，上线时改为发布环境
  baseUrl = 'http://api.huixuebang.com/';
  // baseUrl = 'http://192.168.0.12:9130/';
} else {
  // 开发环境
  // baseUrl = 'http://api.huixuebang.com/'
  // baseUrl = 'http://192.168.0.38:9130/'
  baseUrl = 'http://api.huixuebang.com/';
  // baseUrl = 'http://192.168.0.12:9130/';
  // baseUrl = '/api/';
}

export const urls = {
  baseUrl: baseUrl,

  // 登录
  LOGIN: 'org-backend/student/paper/login',

  // 发送绑定手机验证码
  GETCODE: 'org-backend/student/paper/bind/mobile/sms',

  // 更改手机号
  MOBILE_BIND: 'org-backend/student/paper/mobile',

  // 注意事项确认
  NOTES_ACK: 'org-backend/student/paper/notes/ack',

  // 确认手机号
  MOBILE_ACK: 'org-backend/student/paper/mobile/ack',

  // 学生老师
  PAPER_TEACHER: 'org-backend/student/paper/teachers',

  // 论文阶段
  PAPER_STEP: 'org-backend/student/paper/step',

  // 论文选题
  PAPER_TOPIC_SELECT: 'org-backend/student/paper/topic/select',

  // 论文题目
  PAPER_TOPICS: 'org-backend/student/paper/topics',

  // 学生的论文选题
  PAPER_TOPIC: 'org-backend/student/paper/topic',

  // 更新论文选题大纲
  PAPER_TOPIC_OUTLINE: 'org-backend/student/paper/topic/outline',

  // // 获取签名新
  // GETOSSSIGNATURE: 'hxb-backend/token/oos/signature',

  // 获取上传URL
  // GETOSSSIGNATURE: 'org-backend/student/paper/upload/url',

  // 上传签名
  GETOSSSIGNATURE: 'org-backend/student/paper/upload/signature',

  // 下载模板
  PAPER_DOWNLOAD: 'org-backend/student/paper/download',

  // 提交论文
  PAPER: 'org-backend/student/paper',

  // 提交论文历史
  PAPER_HISTORY: 'org-backend/student/paper/history',

  // 线下答辩问题
  ANSWER_QUESTION: 'org-backend/student/paper/online/answer/questions',

  // 提交线下答辩
  ONLINE_ANSWER: 'org-backend/student/paper/online/answer'
};

// 不需要token的请求
export const noTokenReq = [urls.LOGIN];
