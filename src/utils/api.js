/*
 * @Author:      Arya
 * @DateTime:    2019-12-30
 * @Description: api接口
 */

let baseUrl = 'http://192.168.0.12:9130/'

if (process.env.NODE_ENV === 'production') {
  // 测试部使用的生产环境，上线时改为发布环境
  // baseUrl = 'http://api.huixuebang.com/'
  baseUrl = 'http://192.168.0.12:9130/'
} else {
  // 开发环境
  // baseUrl = 'http://api.huixuebang.com/'
  baseUrl = 'http://192.168.0.12:9130/'
  // baseUrl = 'http://api.huixuebang.com/';
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
  ONLINE_ANSWER: 'org-backend/student/paper/online/answer',

  // 下载学生专属文件
  DOWN_SELF: 'org-backend/student/paper/down/self',

  /* 省考 */

  // 获取当前用户所有批次/选择批次
  EXAM_BATCH: 'org-backend/student/exam/batch',

  // 获取当前用户所有机构
  EXAM_ORG: 'org-backend/student/exam/org',

  // 考试计划列表
  EXAM_BATCH_PLAN: 'org-backend/student/exam/plan',

  // 考试试卷
  EXAM_PLAN_PAPER: 'org-backend/student/exam/plan/{0}/paper',

  // 提交答案
  EXAM_PLAN_ANSWER: 'org-backend/student/exam/plan/{0}/exercise/{1}/answer',

  // 成绩单
  EXAM_SCOREREPORT: 'org-backend/student/exam/scoreReport',

  // 申请复查
  EXAM_PLAN_REVIEW: 'org-backend/student/exam/plan/{0}/batchNo/{1}/review',

  // 上传照片
  EXAM_PLAN_PICTURE: 'org-backend/student/exam/plan/{0}/picture',

  // 获取当前用户所有批次-论文
  PAPER_BATCH: 'org-backend/student/paper/batch',

  // 开始考试
  EXAM_PAPER_TODO: 'org-backend/student/exam/plan/{0}/paper/to-do',

  // 省考注意事项确认
  EXAM_NOTES_ACK: 'org-backend/student/exam/notes/ack'
}

// 不需要token的请求
export const noTokenReq = [urls.LOGIN]
