/*
 * author: Arya
 * description: 登录表单
 * time: 2019-12-12
 */

import React, { Component } from 'react';

import http from '@utils/http';
import { urls } from '@utils/api';

import LoginForm from './login';
import Mobile from './mobile';
import MobileBind from './mobileBind';
import Attention from './attention';
import '@assets/login.scss';
import src from '@assets/img/login.png';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '我是login',
      userInfo: null,
      goBind: false
    };
    this.getData = this.getData.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleBindMobile = this.handleBindMobile.bind(this);
    this.goBindMobile = this.goBindMobile.bind(this);
  }
  componentWillMount() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.setState({
      userInfo: userInfo
    });
    // this.getData();
  }

  /* 子组件点击了登录-且登录成功了 */
  handleLogin(data) {
    this.setState({
      userInfo: data
    });
  }

  /* 绑定手机号成功 */
  handleBindMobile(data) {
    this.setState({
      userInfo: data
    });
  }

  /* 点击了更改手机号 */
  goBindMobile() {
    this.setState({
      goBind: true
    });
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
    let userInfo = this.state.userInfo;
    let sToken = sessionStorage.getItem('sToken');
    // let isShowMobile = userInfo.mobileAck;
    let com = <LoginForm handleLogin={this.handleLogin} />;
    // 登录
    if (!sToken) {
      com = <LoginForm handleLogin={this.handleLogin} />;
      // 已登录 and 未确认手机号
    } else if (sToken) {
      // 是否有手机号
      if (userInfo.mobile && !this.state.goBind) {
        com = (
          <Mobile mobile={userInfo.mobile} goBindMobile={this.goBindMobile} />
        );
      } else {
        com = <MobileBind handleBindMobile={this.handleBindMobile} />;
      }
    }
    let atten;
    if (userInfo && !userInfo.notesAck) {
      atten = <Attention />;
    }
    return (
      <div className="login">
        <div className="login-left"></div>
        {/* <div className="login-right"></div> */}
        <img src={src} className="App-logo" alt="logo" />
        <div className="login-main">{com}</div>
        {atten}
      </div>
    );
  }
}
