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
import store from '@store/index';
import { createHashHistory } from 'history';
import { connect } from 'react-redux';
import { setUserInfo } from '@store/actions';

class Login extends Component {
  // const Login = ({ dispatch }) => {
  constructor(props) {
    super(props);
    this.state = {
      msg: '我是login',
      sToken: null,
      userInfo: null,
      goChangeMobile: false,
      showBindMobile: false,
      showMobile: false,
      showLogin: false,
      showNote: false
    };
    this.handleBindMobile = this.handleBindMobile.bind(this);
    this.goBindMobile = this.goBindMobile.bind(this);
    this.matchComp = this.matchComp.bind(this);

    store.subscribe(() => {
      console.log('state状态改变了，新状态如下');
      console.log(store.getState());
      let state = store.getState();
      this.setState(
        {
          userInfo: state.userInfo,
          sToken: state.userInfo.token
        },
        function() {
          this.matchComp();
        }
      );
    });
  }

  matchComp() {
    let state = this.state;
    if (!state.sToken || !state.userInfo) {
      this.setState({
        showLogin: true,
        showMobile: false,
        showBindMobile: false
      });
    } else {
      if (state.userInfo.mobile && !state.goChangeMobile) {
        this.setState({
          showLogin: false,
          showMobile: true,
          showBindMobile: false
        });
      } else {
        this.setState({
          showLogin: false,
          showMobile: false,
          showBindMobile: true
        });
      }
    }
  }

  componentWillMount() {
    // this.setState(
    //   {
    //     userInfo: this.props.userInfo,
    //     sToken: this.props.userInfo ? this.props.userInfo.token : ''
    //   },
    //   function() {
    //     // this.matchComp();
    //   }
    // );
  }

  /* 绑定手机号成功 */
  handleBindMobile(data) {
    if (this.state.userInfo.notesAck) {
      createHashHistory().push('/main/home');
    } else {
      this.setState({
        showNote: true
      });
    }
  }

  /* 点击了更改手机号 */
  goBindMobile() {
    this.setState(
      {
        goChangeMobile: true
      },
      function() {
        this.matchComp();
      }
    );
  }

  render() {
    let userInfo = this.state.userInfo;
    let sToken = sessionStorage.getItem('sToken');
    let com = <LoginForm />;
    if (this.state.showBindMobile) {
      com = <MobileBind handleBindMobile={this.handleBindMobile} />;
    }
    if (this.state.showMobile) {
      com = (
        <Mobile mobile={userInfo.mobile} goBindMobile={this.goBindMobile} />
      );
    }
    if (this.state.showLogin) {
      com = <LoginForm />;
    }
    let atten;
    if (this.state.showNote) {
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

const mapStateToProps = state => ({
  userInfo: state.userInfo
});

export default connect(mapStateToProps)(Login);
