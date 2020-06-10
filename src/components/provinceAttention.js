/*
 * author: Arya
 * description: 注意事项（弹窗）
 * time: 2019-12-12
 */
import React from 'react'
import { Modal, Button } from 'antd'
import '@assets/attention.scss'
import http from '@utils/http'
import { urls } from '@utils/api'
import { connect } from 'react-redux'
import { createHashHistory } from 'history'
import { setUserInfo } from '@store/actions'
class ProvinceAttention extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      loading: false,
      times: 8,
      isClick: false
    }
  }
  componentDidMount() {
    let timer = setInterval(() => {
      let times = this.state.times

      if (times <= 0) {
        clearInterval(timer)
        this.setState({
          isClick: true
        })
      } else {
        this.setState({
          times: times - 1
        })
      }
    }, 1000)
  }

  handleOk = e => {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.setState({
      loading: true
    })
    http.put(urls.EXAM_NOTES_ACK, null).then(res => {
      if (res) {
        userInfo.examNotesAck = true
        // 用户信息存在本地和redux
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        this.props.dispatch(setUserInfo(userInfo))
        createHashHistory().push('/province/examPlan')
      }
      this.setState({
        loading: false
      })
    })

    this.setState({
      visible: false
    })
  }

  render() {
    return (
      <Modal
        title={[
          <div className="attention-header" key="submit">
            注意事项
          </div>
        ]}
        width={500}
        centered={true}
        closable={false}
        keyboard={false}
        maskClosable={false}
        visible={this.state.visible}
        onOk={this.handleOk}
        footer={[
          <div className="attention-footer" key="submit">
            <Button
              key="submit"
              type="primary"
              disabled={!this.state.isClick}
              loading={this.state.loading}
              onClick={this.handleOk}
            >
              我已仔细阅读上述事项({this.state.times})
            </Button>
          </div>
        ]}
      >
        <p className="attention-content">
          （一）考生应诚信考试，按时参加考试。
          <br />
          （二）考生在答题时，要求考生在考试期间务必打开摄像头，如果系统没有检测到摄像头，则不允许参加考试。
          <br />
          （三）考生在考试期间不得脱离电脑摄像头区域，后台将会对正在作答的考生进行抓拍存档备案。
          <br />
          （四）打开摄像头后，监考官可以在后台查看同步的监控画面，对监控画面进行截图，如果发现考生有作弊行为，可以在线发送作弊警告。
          <br />
          （五)考生在作答过程中严格按照系统提示完成题目输入及上传，确认答题完毕后方可交卷。
          <br />
          （六）考试过程中系统问题处理，及时联系相关工作人员。
        </p>
      </Modal>
    )
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
})
export default connect(mapStateToProps)(ProvinceAttention)
