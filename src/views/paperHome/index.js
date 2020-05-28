/*
 * @Author:      Arya
 * @DateTime:    2019-12-30
 * @Description: 论文首页-主页面
 */

import React from 'react'
import { connect } from 'react-redux'
import User from './user'
import Step from './step'

class PaperHome extends React.Component {
  render() {
    return (
      <div>
        <User />
        <Step />
      </div>
    )
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(PaperHome)
