// 正则规则
const reg_idCard = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
const reg_mobile = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
var reg_code = /^[0-9]{6}$/;
export default {
  // 验证身份证号
  validator_idCard(rule, value, callback) {
    if (value && reg_idCard.test(value)) {
      callback();
    } else {
      callback('请输入正确的身份证号码！');
    }
  },
  // 验证登录密码
  validator_login_password(rule, value, callback) {
    if (!value) {
      callback('请输入密码！');
    } else if (value.length < 6) {
      callback('密码在6位数以上！');
    } else {
      callback();
    }
  },
  // 验证手机号
  validator_mobile(rule, value, callback) {
    if (value && reg_mobile.test(value)) {
      callback();
    } else {
      callback('请输入正确的手机号码！');
    }
  },
  // 验证验证码6位数字
  validator_code(rule, value, callback) {
    if (value && reg_code.test(value)) {
      callback();
    } else {
      callback('请输入正确的验证码！');
    }
  }
};
