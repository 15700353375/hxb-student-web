/*
 * author: Arya
 * description: 登录页面
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

// 引入action
import { setUserInfo } from '@store/actions.js';

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
  componentDidMount() {
    // let { setUserInfo } = this.props;
  }

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
            setUserInfo(res.body);
            sessionStorage.setItem('sToken', res.body.token);
            // createHashHistory().push('/home');
            // 是否绑定手机号 and 是否确认了注意事项
            this.props.handleLogin(res.body);
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

export default Form.create({ name: 'normal_login' })(LoginForm);

// mapStateToProps：将state映射到组件的props中
// const mapStateToProps = (state) => {
//   return {
//     userInfo: state.userInfo,
//   }
// }

// // mapDispatchToProps：将dispatch映射到组件的props中
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     setUserInfo (data) {
//         // 如果不懂这里的逻辑可查看前面对redux-thunk的介绍
//         dispatch(setUserInfo(data))
//         // 执行setPageTitle会返回一个函数
//         // 这正是redux-thunk的所用之处:异步action
//         // 上行代码相当于
//         /*dispatch((dispatch, getState) => {
//             dispatch({ type: 'SET_PAGE_TITLE', data: data })
//         )*/
//     }
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Test)
