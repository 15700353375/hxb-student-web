import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

import http from '../../utils/http';
import { urls } from '../../utils/api';
import '../../assets/login.scss';
import idCardUrl from '../../assets/img/login-idCard.png';
const Idcard = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
import passwordUrl from '../../assets/img/login-password.png';

import { createHashHistory, createBrowserHistory } from 'history'; // 是hash路由 history路由 自己根据需求来定
const history = createHashHistory();
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: '',
        password: ''
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateIdCard = this.validateIdCard.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        http.postJson(urls.LOGIN, values).then(res => {
          if (res) {
            localStorage.setItem('userInfo', JSON.stringify(res.body));
            sessionStorage.setItem('sToken', res.body.token);
            // debugger;
            // this.props.history.push('/home');
            history.push('/home');
            // window.reactHistory.push('/home');
          }
        });
      }
    });
  };

  validateIdCard = (rule, value, callback) => {
    if (value && Idcard.test(value)) {
      callback();
    } else {
      callback('请输入正确的身份证号码！');
    }
  };
  validatePassword = (rule, value, callback) => {
    if (!value) {
      callback('请输入密码！');
    } else if (value.length < 6) {
      callback('密码在6位数以上！');
    } else {
      callback();
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form login-content">
        <Form.Item>
          {getFieldDecorator('idCard', {
            rules: [
              {
                validator: this.validateIdCard
              }
            ],
            validateTrigger: 'onBlur'
          })(
            <Input
              prefix={<img src={idCardUrl} />}
              placeholder="请输入身份证号"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              {
                validator: this.validatePassword
              }
            ]
          })(
            <Input
              prefix={<img src={passwordUrl} />}
              type="password"
              placeholder="请输入密码"
            />
          )}
        </Form.Item>
        <Form.Item className="login-btn">
          <Button
            block
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create({ name: 'normal_login' })(LoginForm);

// ReactDOM.render(<WrappedNormalLoginForm />, mountNode);
