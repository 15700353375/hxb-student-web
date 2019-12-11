import React, { Component } from 'react';
import '../../assets/login.scss';
import http from '../../utils/http';
import { urls } from '../../utils/api';

import { Form, Icon, Input, Button, Checkbox } from 'antd';
import LoginForm from './login';
import src from '../../assets/img/login.png';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '我是login'
    };
    this.getData = this.getData.bind(this);
  }
  componentDidMount() {
    // this.getData();
  }

  getData() {
    let data = {
      idCard: '510304199110301510',
      password: '301510'
    };
    http.postJson(urls.LOGIN, data).then(res => {
      if (res) {
        debugger;
      }
    });
  }
  render() {
    return (
      <div className="login">
        <div className="login-left"></div>
        {/* <div className="login-right"></div> */}
        <img src={src} className="App-logo" alt="logo" />
        <div className="login-main">
          <h2>欢迎登录论文管理系统</h2>
          <LoginForm />
        </div>
      </div>
    );
  }
}
