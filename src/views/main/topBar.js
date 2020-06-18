/*
 * @Author:      Arya
 * @DateTime:    2019-12-30
 * @Description: 顶部栏
 */

import React, { Component } from 'react'
import { Menu, Dropdown } from 'antd'
import '@assets/home.scss'
import { connect } from 'react-redux'
import homeUrl from '@assets/img/home.png'
import backUrl from '@assets/img/web2x_1.通用_2.Icon图标_Line_left.png'
import avatarUrl from '@assets/img/avatar.png'

import store from '@store'
import { createHashHistory } from 'history' // 是hash路由 history路由 自己根据需求来定
import common from '@utils/common'

class TopBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentRoute: ''
    }
    this.goHome = this.goHome.bind(this)
    this.loginOut = this.loginOut.bind(this)
    store.subscribe(() => {
      let state = store.getState()
      this.setState({
        currentRoute: state.currentRoute
      })
    })
  }
  componentDidMount() {
    this.setState({
      currentRoute: this.props.currentRoute
    })
  }

  componentWillUnmount = () => {
    this.setState = (state, callback) => {
      return
    }
  }

  goHome() {
    createHashHistory().push('/home')
  }

  goBack() {
    createHashHistory().push('/province/examPlan')
  }
  loginOut() {
    common.loginOut()
  }

  render() {
    let userInfo = {
      name: ''
    }
    let exam = {
      courseName: ''
    }
    userInfo = this.props.userInfo || userInfo
    exam = this.props.exam || exam
    let leftComp
    let currentRoute = this.state.currentRoute
    console.log(this.props.exam)
    let titleName = '欢迎来到学生系统'
    if (currentRoute) {
      if (currentRoute.pathname.indexOf('province') > -1) {
        if (currentRoute.pathname == '/province/exam') {
          titleName = exam.courseName + '考试中'
        } else {
          titleName = '学生省考系统'
        }
      } else if (currentRoute.pathname.indexOf('main') > -1) {
        titleName = '学生论文系统'
      }
    }
    if (currentRoute && currentRoute.pathname != '/home') {
      if (
        currentRoute.pathname == '/province/examDetail' ||
        currentRoute.pathname == '/province/exam'
      ) {
        leftComp = (
          <div className="topbar-home" onClick={this.goBack}>
            <img src={backUrl} className="topbar-icon-home" alt="home" />
            <span>返回</span>
          </div>
        )
      } else {
        leftComp = (
          <div className="topbar-home" onClick={this.goHome}>
            <img src={homeUrl} className="topbar-icon-home" alt="home" />
            <span>首页</span>
          </div>
        )
      }
    } else {
      leftComp = <div className="topbar-home"></div>
    }
    const menu = (
      <Menu>
        <Menu.Item>
          <a rel="noopener noreferrer" onClick={this.loginOut}>
            退出
          </a>
        </Menu.Item>
      </Menu>
    )

    return (
      <div className="topbar">
        {leftComp}
        <span className="topbar-title">{titleName}</span>
        <div className="topbar-user">
          <img className="topbar-icon-home" src={avatarUrl} alt="home" />
          {/* <span>{userInfo.name}</span> */}
          <Dropdown overlay={menu} placement="bottomRight">
            <span>{userInfo.name}</span>
          </Dropdown>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  exam: state.exam,
  currentRoute: state.currentRoute
})

export default connect(mapStateToProps)(TopBar)
