/*
 * author: Arya
 * description: 登录表单组件
 * time: 2019-12-12
 */
import React from 'react';
import { Form, Input, Button } from 'antd';
import { createHashHistory } from 'history';
import http from '@utils/http';
import { urls } from '@utils/api';
import verification from '@utils/verification';

// connect方法的作用：将额外的props传递给组件，并返回新的组件，组件在该过程中不会受到影响
import { connect } from 'react-redux';
import { setUserInfo } from '@store/actions';

import '@assets/login.scss';
import idCardUrl from '@assets/img/login-idCard.png';
import passwordUrl from '@assets/img/login-password.png';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        });
        http.postJson(urls.LOGIN, values).then(res => {
          if (res) {
            localStorage.setItem('userInfo', JSON.stringify(res.body));
            this.props.dispatch(setUserInfo(res.body));
            sessionStorage.setItem('sToken', res.body.token);
            if (res.body) {
              if (res.body.mobileAck && res.body.notesAck) {
                createHashHistory().push('/main/home');
              }
            }
          }
          this.setState({
            loading: false
          });
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const validator_idCard = verification.validator_idCard;
    const validator_login_password = verification.validator_login_password;
    return (
      <div>
        <h2>欢迎登录论文管理系统</h2>
        <Form onSubmit={this.handleSubmit} className="login-form login-content">
          <Form.Item>
            {getFieldDecorator('idCard', {
              rules: [
                {
                  validator: validator_idCard
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
                  validator: validator_login_password
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
              size="large"
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={this.state.loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const Comp = connect()(LoginForm);
export default Form.create({ name: 'normal_login' })(Comp);
