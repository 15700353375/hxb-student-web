/*
 * author: Arya
 * description: 登录主页面
 * time: 2019-12-12
 */

import React, { Component } from 'react'

import LoginForm from './login'
import Mobile from './mobile'
import MobileBind from './mobileBind'
import '@assets/login.scss'
import src from '@assets/img/login.png'
import store from '@store/index'
import { createHashHistory } from 'history'
import { connect } from 'react-redux'
import bgUrl from '@assets/img/login_bg.png'
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sToken: null,
      userInfo: null,
      goChangeMobile: false,
      showBindMobile: false,
      showMobile: false,
      showLogin: false
    }
    this.handleBindMobile = this.handleBindMobile.bind(this)
    this.goBindMobile = this.goBindMobile.bind(this)
    this.matchComp = this.matchComp.bind(this)

    store.subscribe(() => {
      let state = store.getState()
      this.setState(
        {
          userInfo: state.userInfo,
          sToken: state.userInfo ? state.userInfo.token : ''
        },
        function() {
          this.matchComp()
        }
      )
    })
  }

  matchComp() {
    let state = this.state
    if (!state.sToken || !state.userInfo) {
      this.setState({
        showLogin: true,
        showMobile: false,
        showBindMobile: false
      })
    } else {
      // 有手机号、没有去更改手机号
      if (state.userInfo.mobile && !state.goChangeMobile) {
        // 没有确认手机号 ， 去确认手机号
        if (!state.userInfo.mobileAck) {
          this.setState({
            showLogin: false,
            showMobile: true,
            showBindMobile: false
          })
        } else {
          // createHashHistory().push('/home')
        }
      } else {
        this.setState({
          showLogin: false,
          showMobile: false,
          showBindMobile: true
        })
      }
      if (localStorage.getItem('goChangeMobile')) {
        this.setState({
          showLogin: false,
          showMobile: false,
          showBindMobile: true
        })
      }
      // if (state.userInfo.mobileAck) {
      //   createHashHistory().push('/main/home')
      // }
    }
  }

  componentWillMount() {
    this.setState(
      {
        userInfo: this.props.userInfo,
        sToken: this.props.userInfo ? this.props.userInfo.token : ''
      },
      function() {
        this.matchComp()
      }
    )
  }

  /* 绑定手机号成功 */
  handleBindMobile(data) {
    if (data) {
      createHashHistory().replace('/home')
    } else {
      localStorage.removeItem('goChangeMobile')
      this.setState(
        {
          goChangeMobile: false
        },
        function() {
          this.matchComp()
        }
      )
    }
  }

  /* 点击了更改手机号 */
  goBindMobile() {
    this.setState(
      {
        goChangeMobile: true
      },
      function() {
        localStorage.setItem('goChangeMobile', true)
        this.matchComp()
      }
    )
  }

  render() {
    let userInfo = this.state.userInfo
    let com = <LoginForm />
    if (this.state.showBindMobile) {
      com = <MobileBind handleBindMobile={this.handleBindMobile} />
    }
    if (this.state.showMobile && userInfo) {
      com = (
        <Mobile
          mobile={userInfo.mobile}
          goBindMobile={this.goBindMobile}
          handleBindMobile={this.handleBindMobile}
        />
      )
    }
    if (this.state.showLogin) {
      com = <LoginForm />
    }
    return (
      <div className="login">
        <div className="login-left">
          <img src={bgUrl} />
        </div>
        <img src={src} className="App-logo" alt="logo" />
        <div className="login-main">{com}</div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(Login)
