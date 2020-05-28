/*
 * @Author:      Arya
 * @DateTime:    2019-12-30
 * @Description: 首页-个人信息组件
 */

import React from 'react'
import { connect } from 'react-redux'
import common from '@utils/common'
import '@assets/examDetail.scss'
import { Table, message } from 'antd'
import http from '@utils//http'
import { urls } from '@utils//api'
import User from './user'
class ExamDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          title: '批次',
          dataIndex: 'batchNo'
        },
        {
          title: '课程',
          dataIndex: 'courseName'
        },
        {
          title: '考试时间',
          dataIndex: 'examStartTime',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.examStartTime - b.examStartTime,
          render: text => <span>{common.formatTime(text)}</span>
        },
        /* status 1未开始  2正在考试  3已结束 4缺考 */
        {
          title: '考试状态',
          dataIndex: 'status',
          render: text => (
            <span className={`status${text}`}>{this.dealStatus(text)}</span>
          )
        },
        {
          title: '成绩',
          dataIndex: 'score',
          render: (text, record, index) => {
            return record.status == 4 ? (
              <span className="status">缺考</span>
            ) : record.status == 3 ? (
              <span>{record.score}</span>
            ) : (
              <span>--</span>
            )
          }
        },
        {
          title: '操作',
          render: (text, record, index) => {
            return <a onClick={() => this.reCheck(record)}>申请复查</a>
          }
        }
      ],
      data: []
    }
    this.getData = this.getData.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    console.log(this.props.userInfo)
    this.getData()
  }

  dealStatus(status) {
    let name = ''
    switch (status) {
      case 1:
        name = '未开始'
        break
      case 2:
        name = '进行中'
        break
      case 3:
        name = '已结束'
        break
      case 4:
        name = '已结束'
        break
    }
    return name
  }

  onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra)
  }

  /* 申请复查 */
  reCheck(item) {
    message.success('申请成功')
  }

  getData() {
    http.get(urls.EXAM_SCOREREPORT, null).then(res => {
      if (res) {
        this.setState({
          data: res.body
        })
      }
    })
  }
  render() {
    const { columns, data } = this.state
    return (
      <div className="exam-detail">
        <User />
        <div className="exam-detail-main">
          <Table
            columns={columns}
            dataSource={data}
            onChange={this.onChange}
            size="middle"
          />
          ,
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(ExamDetail)
