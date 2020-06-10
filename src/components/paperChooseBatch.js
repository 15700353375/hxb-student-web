/*
 * @Author:      Arya
 * @DateTime:    2020-06-02
 * @Description: 选择批次弹窗-论文部分
 */
import React from 'react'
import { Modal, Button } from 'antd'
import http from '@utils/http'
import { urls } from '@utils/api'
import '@assets/chooseBatch.scss'
import { connect } from 'react-redux'
import { setUserInfo } from '@store/actions'
import { createHashHistory } from 'history'
class PaperChooseBatch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      batchList: [],
      currentBatch: null
    }
    this.handleCancel = this.handleCancel.bind(this)
    this.getBatch = this.getBatch.bind(this)
    this.goPage = this.goPage.bind(this)
  }
  componentDidMount() {
    this.getBatch()
  }
  /* 获取当前用户所有批次 */
  getBatch() {
    http.get(urls.PAPER_BATCH).then(res => {
      if (res) {
        this.setState({
          batchList: res.body
        })
      }
    })
  }

  /* 选择批次 */
  changeBatch(item) {
    this.setState({
      currentBatch: item
    })
  }

  /* 进入主页面 */
  goPage() {
    http
      .post(urls.PAPER_BATCH + `/${this.state.currentBatch.key}`)
      .then(res => {
        if (res) {
          sessionStorage.setItem('sToken', res.body.token)

          let userInfo = localStorage.getItem('userInfo')
          userInfo = JSON.parse(userInfo)
          // userInfo.examNo = res.body.examNo
          let newData = { ...userInfo, ...res.body }
          localStorage.setItem('userInfo', JSON.stringify(newData))
          this.props.dispatch(setUserInfo(newData))
          // 如果没有确认注意事项、就去确认，否则直接进入
          if (res.body.notesAck) {
            createHashHistory().push('/main/home')
          } else {
            this.props.paperCloseModal(true)
          }
        }
      })
  }

  handleCancel() {
    this.setState({
      visible: false
    })
    this.props.paperCloseModal()
  }
  render() {
    const { visible, loading, batchList, currentBatch } = this.state
    return (
      <Modal
        title="请选择批次"
        centered
        width={400}
        visible={visible}
        onOk={this.handleCancel}
        onCancel={this.handleCancel}
        footer={[
          <Button
            block
            key="submit"
            type="primary"
            disabled={!currentBatch}
            loading={loading}
            onClick={this.goPage}
          >
            进入
          </Button>
        ]}
      >
        <div className="batch-title">请选择批次</div>
        {batchList.length ? (
          batchList.map((item, index) => (
            <p
              className={`org-list ${
                currentBatch && currentBatch.key == item.key ? 'active' : null
              }`}
              key={index}
              onClick={() => this.changeBatch(item)}
            >
              {item.value}
            </p>
          ))
        ) : (
          <div>暂无批次</div>
        )}
      </Modal>
    )
  }
}

export default connect()(PaperChooseBatch)
