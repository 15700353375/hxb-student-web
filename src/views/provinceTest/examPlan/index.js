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
import { Modal, Button, message } from 'antd'
import { createHashHistory } from 'history'
import common from '@utils/common'
import Countdown from '@components/countdown'
import TestCamera from '@components/testCamera'
import kongUrl from '@assets/img/web1x_kaoshijihua_kong.png'
import cameraUrl from '@assets/img/web1x_shexiangtou.png'

class ExamPlan extends React.Component {
  constructor(prop) {
    super(prop)
    this.state = {
      loading: false,
      isOpen: false,
      isShowCamera: false,
      allExamTime: 0,
      actualExamTime: 0,
      list: []
    }
    this.getData = this.getData.bind(this)
    this.changeOpen = this.changeOpen.bind(this)
    this.timeOver = this.timeOver.bind(this)
    this.testCamera = this.testCamera.bind(this)
    this.closeModal = this.closeModal.bind(this)
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

  /* 摄像头测试 */
  testCamera() {
    this.setState({
      isShowCamera: true
    })
  }
  /* 关闭摄像头弹窗 */
  closeModal() {
    this.setState({
      isShowCamera: false
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
  goTest(item, continueExam) {
    console.log(item, this.props.history)
    let that = this
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
        if (!continueExam) {
          common.checkOpenCamera().then(res => {
            that.examTodo(item)
          })
        } else {
          common.checkOpenCamera().then(res => {
            createHashHistory().push({
              pathname: 'exam',
              search: `?planId=${item.id}`,
              state: { model: true },
              query: { planId: item.id }
            })
          })
        }
      }
    })
  }

  /* 开始考试 */
  examTodo(item) {
    http.put(urls.EXAM_PAPER_TODO, null, item.id).then(res => {
      if (res && res.body) {
        createHashHistory().push({
          pathname: 'exam',
          search: `?planId=${item.id}`,
          state: { model: true },
          query: { planId: item.id }
        })
      }
    })
  }

  /* 获取右侧考试数据 */
  getExamDetail() {
    http.get(urls.EXAM_SCOREREPORT, null).then(res => {
      if (res) {
        let list = res.body
        let actualList = _.filter(list, function(o) {
          return o.joinTime != null
        })
        this.setState({
          allExamTime: list.length,
          actualExamTime: actualList.length
        })
      }
    })
  }

  /* 倒计时结束 */
  timeOver() {
    this.getData()
  }

  dealStyle(item) {
    let classname = ''
    if (item.status == 1) {
      classname = 'status1'
    } else if (item.status == 2) {
      // 已经开始了
      if (item.continueExam) {
        classname = 'status4'
      } else {
        classname = 'status2'
      }
    } else if (item.status == 3) {
      classname = 'status3'
    }
    return classname
  }

  render() {
    const {
      list,
      loading,
      isOpen,
      allExamTime,
      actualExamTime,
      isShowCamera
    } = this.state
    const { userInfo } = this.props
    return (
      <div className="exam-plan-mian clearfix">
        {isShowCamera ? <TestCamera closeModal={this.closeModal} /> : null}
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
            </div>
          </div>
        </div>
        <div className="exam-plan">
          <div className="exam-plan-title">
            考试计划：
            {userInfo ? (
              <span className="batch">{userInfo.chooseBatch}</span>
            ) : null}
            <a className="float_right" onClick={this.testCamera}>
              <img src={cameraUrl} />
              摄像头测试
            </a>
            <span className="timer">
              本次考试成绩公布时间：
              {userInfo && userInfo.scorePublishAt
                ? common.formatTime(userInfo.scorePublishAt)
                : ''}
            </span>
          </div>
          {list && list.length ? (
            <div className="exam-plan-list clearfix">
              {list.map((item, index) => (
                <div key={index} className="exam-plan-item">
                  <div className="exam-plan-top clearfix">
                    <span className={`left ${this.dealStyle(item)}`}></span>
                    <div className="title">{item.courseName}</div>
                    {/* status 1未开始  2正在考试  3已结束 */}
                    {item.status == 1 ? (
                      <span className="right status1">未开始</span>
                    ) : item.status == 2 ? (
                      <span className="right status4">
                        {item.continueExam ? (
                          <Countdown
                            surplusSeconds={item.surplusSeconds}
                            timeOver={this.timeOver}
                          />
                        ) : (
                          <span className="status2">
                            {!item.surplusSeconds ? (
                              <span className="status2">已开始</span>
                            ) : (
                              <Countdown
                                surplusSeconds={item.surplusSeconds}
                                timeOver={this.timeOver}
                              />
                            )}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="right status3">考试结束</span>
                    )}
                  </div>
                  <div className="exam-time">
                    考试时间：
                    {common.formatTime(item.examAt, 'YYYY/MM/DD HH:mm')} -{' '}
                    {common.formatTime(item.examEndAt, 'YYYY/MM/DD HH:mm')}
                  </div>
                  <div className="exam-time">
                    考试时长：{item.examDuration}分钟
                  </div>
                  <div className="exam-oper">
                    {item.status == 2 ? (
                      <div>
                        {item.continueExam ? (
                          <Button
                            key="submit"
                            type="primary"
                            loading={loading}
                            onClick={() => this.goTest(item, true)}
                          >
                            继续考试
                          </Button>
                        ) : (
                          <Button
                            key="submit"
                            type="primary"
                            loading={loading}
                            onClick={() => this.goTest(item)}
                          >
                            开始考试
                          </Button>
                        )}
                      </div>
                    ) : item.status == 3 ? (
                      <div>
                        {item.score != null ? (
                          <span className="score">
                            最终分数：
                            <span className={item.score < 60 ? 'denger' : null}>
                              {item.score}分
                            </span>
                          </span>
                        ) : (
                          <span className="noScore">成绩未公布</span>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="exam-plan noPlan">
              <img src={kongUrl} />
              <div>暂时还没有考试计划哦！</div>
            </div>
          )}
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
})
export default connect(mapStateToProps)(ExamPlan)
