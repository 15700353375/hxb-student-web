/*
 * @Author:      Arya
 * @DateTime:    2019-12-30
 * @Description: 首页-个人信息组件
 */

import React from 'react'
import { connect } from 'react-redux'
import '@assets/user.scss'
import avatarUrl from '@assets/img/avatar.png'

class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.getData = this.getData.bind(this)
  }

  componentDidMount() {
    console.log(this.props.userInfo)
    this.getData()
  }

  getData() {
    // let userInfo = JSON.parse(localStorage.getItem('userInfo'))
  }
  render() {
    let userInfo = this.props.userInfo
    return (
      <div className="user-block">
        <div className="user-block-top exam-detail-user clearfix">
          <img src={avatarUrl} alt="home" />
          {userInfo ? (
            <div className="user-con">
              <div className="user-name">{userInfo.name}</div>
              <div className="user-info">
                <span>准考证号：{userInfo.examNo}</span>
                <span>身份证号：{userInfo.idCard}</span>
                <span>手机号：{userInfo.mobile}</span>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(User)
