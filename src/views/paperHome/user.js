/*
 * @Author:      Arya
 * @DateTime:    2019-12-30
 * @Description: 首页-个人信息组件
 */

import React from 'react'
import { connect } from 'react-redux'
import '@assets/user.scss'

import http from '../../utils/http'
import { urls } from '../../utils/api'
import avatarUrl from '@assets/img/avatar.png'
import qqUrl from '@assets/img/qq.png'
import phoneUrl from '@assets/img/phone.png'

class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      schoolManager: {
        mobile: '',
        name: '',
        qq: ''
      },
      thesisSupervisionTeacher: {
        mobile: '',
        name: '',
        qq: ''
      }
    }
    this.getData = this.getData.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    http.get(urls.PAPER_TEACHER).then(res => {
      if (res) {
        this.setState({
          thesisSupervisionTeacher:
            res.body.thesisSupervisionTeacher ||
            this.state.thesisSupervisionTeacher,
          schoolManager: res.body.schoolManager || this.state.schoolManager
        })
      }
    })
  }
  render() {
    let user = {
      name: '',
      majorName: ''
    }
    let userInfo = this.props.userInfo || user
    let { thesisSupervisionTeacher, schoolManager } = this.state
    return (
      <div className="user-block">
        <div className="user-block-top clearfix">
          <img src={avatarUrl} alt="home" />
          <div className="user-con">
            <div className="user-name">
              学员{userInfo.name}，欢迎登录论文管理系统
            </div>
            <div className="user-major">专业: {userInfo.majorName}</div>
          </div>
        </div>
        <div className="user-block-bottom clearfix">
          <div className="teacher-name">
            <div>论文指导老师: {thesisSupervisionTeacher.name}</div>
            <div>学籍管理老师: {schoolManager.name}</div>
          </div>
          <div className="teacher-mobile">
            <div>
              <img src={phoneUrl} alt="home" />
              {thesisSupervisionTeacher.mobile}
            </div>
            <div>
              <img src={phoneUrl} alt="home" />
              {schoolManager.mobile}
            </div>
          </div>
          <div className="teacher-mobile">
            <div>
              <img src={qqUrl} alt="home" />
              {thesisSupervisionTeacher.qq}
            </div>
            <div>
              <img src={qqUrl} alt="home" />
              {schoolManager.qq}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(User)
