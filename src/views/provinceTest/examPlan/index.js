/*
 * @Author:      Arya
 * @DateTime:    2020-05-21
 * @Description: 省考首页
 */
import React from 'react'
import { connect } from 'react-redux'
import http from '@utils/http'
import { urls } from '@utils/api'
import '@assets/examPlan.scss'
import { Modal, Button } from 'antd'
import { createHashHistory } from 'history'
import common from '@utils/common'
class ExamPlan extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {
      loading: false,
      isOpen: false,
      allExamTime: 0,
      actualExamTime: 0,
      list: []
    }
    this.getData = this.getData.bind(this)
    this.changeOpen = this.changeOpen.bind(this)
  }
  componentDidMount() {
    this.getData()
    this.getExamDetail()
  }

  /* 注意事项 展开收起 */
  changeOpen() {
    let isOpen = this.state.isOpen
    this.setState({
      isOpen: !isOpen
    })
  }

  /* 获取数据 */
  getData() {
    http.get(urls.EXAM_BATCH_PLAN, null).then(res => {
      if (res) {
        this.setState({
          list: res.body
        })
      }
    })
  }

  /* 考试 */
  goTest(item) {
    console.log(item, this.props.history)
    Modal.warning({
      title: '摄像头授权提醒！',
      content: (
        <div>
          <p>为了保障网上考试的公平公正及纪律性，我们将调用摄像头权限。</p>
          <p>
            我们承诺妥善保管您的考试照片信息，不向除考试监管单位的第三方透露你的考试照片信息。
          </p>
        </div>
      ),
      okText: '我知道了',
      onOk() {
        console.log('OK考试去')
        createHashHistory().push({
          pathname: 'exam',
          search: `?planId=${item.id}`,
          state: { model: true },
          query: { planId: item.id }
        })
        // this.props.history.push({ path: '/province/exam', query: { name: ' sunny' } })
      }
    })
  }

  /* 获取右侧考试数据 */
  getExamDetail() {
    http.get(urls.EXAM_SCOREREPORT, null).then(res => {
      if (res) {
        let list = res.body
        let actualList = _.filter(list, function(o) {
          return o.score != null
        })
        this.setState({
          allExamTime: list.length,
          actualExamTime: actualList.length
        })
      }
    })
  }

  render() {
    const { list, loading, isOpen, allExamTime, actualExamTime } = this.state
    return (
      <div className="exam-plan-mian clearfix">
        <div className="exam-plan-right">
          <div className="exam-right-top">
            <div className="exam-card">成绩查询</div>
            <div className="clearfix">
              <div className="exam-times">
                <div className="exam-times-num">{allExamTime}次</div>
                <div className="exam-times-label">应考次数</div>
              </div>
              <div className="exam-times">
                <div className="exam-times-num">{actualExamTime}次</div>
                <div className="exam-times-label">实考次数</div>
              </div>
            </div>
            <div className="clearfix text-center margin-T20">
              <Button
                key="submit"
                type="primary"
                onClick={() => createHashHistory().push('/province/examDetail')}
              >
                查看历次考试成绩详情
              </Button>
            </div>
          </div>
          <div className="exam-right-bottom">
            <div className="exam-card">
              注意事项
              <a onClick={this.changeOpen}>{isOpen ? '收起' : '展开'}</a>
            </div>
            <div
              className={`exer-right-bottom-content ${isOpen ? '' : 'close'}`}
            >
              (一)参加论文写作和答辩的学生须严格按照规定时间及流程完成此项工作。
              否则将顺延至下一批次重新完成此项工作。
              <br />
              (二)论文写作的论文稿件,请学生自行备份底稿,以备遗失弥补。
            </div>
          </div>
        </div>
        <div className="exam-plan">
          <div className="exam-plan-title">
            考试计划：<span>191次</span>
          </div>
          <div className="exam-plan-list clearfix">
            {list.map((item, index) => (
              <div key={index} className="exam-plan-item">
                <div className="exam-plan-top clearfix">
                  <span className="left"></span>
                  <div className="title">{item.courseName}</div>
                  {/* status 1未开始  2正在考试  3已结束 */}
                  {item.status == 1 ? (
                    <span className="right status1">未开始</span>
                  ) : item.status == 2 ? (
                    <span className="right status2">正在考试</span>
                  ) : (
                    <span className="right status3">考试结束</span>
                  )}
                </div>
                <div className="exam-time">
                  考试时间：{common.formatTime(item.examAt)}
                </div>
                <div className="exam-time">
                  考试时长：{item.examDuration}分钟
                </div>
                <div className="exam-oper">
                  {item.status == 2 ? (
                    <Button
                      key="submit"
                      type="primary"
                      loading={loading}
                      onClick={() => this.goTest(item)}
                    >
                      进入
                    </Button>
                  ) : item.status == 3 ? (
                    <span className="score">
                      最终分数：
                      {item.score != null ? (
                        <span className={item.score < 60 ? 'denger' : null}>
                          {item.score}分
                        </span>
                      ) : null}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
})
export default connect(mapStateToProps)(ExamPlan)
