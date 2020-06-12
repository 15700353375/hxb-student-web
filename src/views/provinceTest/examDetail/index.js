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
          render: (text, record, index) => {
            return (
              <span>
                {common.formatTime(record.examStartTime, 'YYYY/MM/DD HH:mm')} -{' '}
                {common.formatTime(record.examEndTime, 'YYYY/MM/DD HH:mm')}
              </span>
            )
          }
        },
        {
          title: '参考时间',
          dataIndex: 'joinTime',
          defaultSortOrder: 'descend',
          render: text => (
            <span>{common.formatTime(text, 'YYYY/MM/DD HH:mm')}</span>
          )
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
            ) : record.status == 3 && record.score != null ? (
              <span>{record.score}分</span>
            ) : record.status == 3 && record.score == null ? (
              <span>待公布</span>
            ) : (
              <span>--</span>
            )
          }
        },
        {
          title: '复查状态',
          dataIndex: 'review',
          render: (text, record, index) =>
            !record.review && record.reviewScore == null ? (
              <span>--</span>
            ) : record.review && record.reviewScore == null ? (
              <span>复查中</span>
            ) : (
              <span>复查结果：{record.reviewScore}分</span>
            )
        },
        {
          title: '操作',
          render: (text, record, index) => {
            return record.canApplyReview && !record.review ? (
              <a onClick={() => this.reCheck(record)}>申请复查</a>
            ) : (
              <span>--</span>
            )
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
    http
      .put(urls.EXAM_PLAN_REVIEW, null, item.planId, item.batchNo)
      .then(res => {
        if (res) {
          message.success('申请成功')
          this.getData()
        }
      })
  }

  getData() {
    http.get(urls.EXAM_SCOREREPORT, null).then(res => {
      if (res) {
        this.setState({
          data: this.dealList(res.body)
        })
      }
    })
  }

  dealList(data) {
    if (!data || !data.length) return []
    data.forEach((item, index) => {
      item['ind'] = index
    })

    return data
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
            rowKey="ind"
            locale={{ emptyText: '暂无数据' }}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(ExamDetail)
