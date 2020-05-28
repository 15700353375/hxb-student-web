/*
 * @Author:      Arya
 * @DateTime:    2020-05-22
 * @Description: 选择批次弹窗
 */
import React from 'react'
import { Modal, Button } from 'antd'
import http from '@utils/http'
import { urls } from '@utils/api'
import '@assets/chooseBatch.scss'
import { createHashHistory } from 'history'
class ChooseBatch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      orgList: [],
      batchList: [],
      currentOrg: null,
      currentBatch: null
    }
    this.handleCancel = this.handleCancel.bind(this)
    this.getOrg = this.getOrg.bind(this)
    this.getBatch = this.getBatch.bind(this)
    this.goPage = this.goPage.bind(this)
  }
  componentDidMount() {
    this.getOrg()
  }

  /* 获取当前账号所有机构 */
  getOrg() {
    http.get(urls.EXAM_ORG).then(res => {
      if (res) {
        this.setState({
          orgList: res.body
        })
      }
    })
  }

  /* 获取当前用户所有批次 */
  getBatch() {
    http.get(urls.EXAM_BATCH).then(res => {
      if (res) {
        this.setState({
          batchList: res.body
        })
      }
    })
  }

  /* 选择院校  重置token */
  goSchool(item) {
    http.put(urls.EXAM_ORG + `/${item.key}`).then(res => {
      if (res) {
        sessionStorage.setItem('sToken', res.body.token)
        let userInfo = localStorage.getItem('userInfo')
        userInfo = JSON.parse(userInfo)
        userInfo.idCard = res.body.idCard
        userInfo.orgId = res.body.orgId
        userInfo.orgName = res.body.orgName
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        this.getBatch()
        this.setState({
          currentOrg: item
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
    http.put(urls.EXAM_BATCH + `/${this.state.currentBatch.key}`).then(res => {
      if (res) {
        sessionStorage.setItem('sToken', res.body.token)
        createHashHistory().push('/province/examPlan')
      }
    })
  }

  handleCancel() {
    this.setState({
      visible: false
    })
    this.props.closeModal()
  }
  render() {
    const {
      visible,
      loading,
      batchList,
      orgList,
      currentOrg,
      currentBatch
    } = this.state
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
        <div className="batch-title">请选择院校</div>
        {orgList.length ? (
          orgList.map((item, index) => (
            <p
              className={`org-list ${
                currentOrg && currentOrg.key == item.key ? 'active' : null
              }`}
              key={index}
              onClick={() => this.goSchool(item)}
            >
              {item.value}
            </p>
          ))
        ) : (
          <div>暂无院校</div>
        )}

        <div className="batch-title margin-T20">请选择批次</div>
        <div className="clearfix">
          {batchList.length ? (
            batchList.map((item, index) => (
              <p
                className={`batch-list ${
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
        </div>
      </Modal>
    )
  }
}

export default ChooseBatch
