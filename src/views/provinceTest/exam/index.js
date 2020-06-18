/*
 * @Author:      Arya
 * @DateTime:    2020-05-25
 * @Description: 考试页面
 */
import React from 'react'
import { connect } from 'react-redux'
import http from '@utils/http'
import { urls } from '@utils/api'
import '@assets/exam.scss'
import common from '@utils/common'
import { setExam } from '@store/actions'
import { createHashHistory } from 'history'
import { Input, Button, Modal, message } from 'antd'
const { confirm } = Modal
import Camera from '@components/camera'

class Exam extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowCamera: true,
      loading: false,
      planId: null,
      surplusSeconds: null,
      lastTime: null,
      timer: null,
      paperData: {
        examDuration: null,
        fullScore: null,
        exerciseTypes: []
      },
      list: []
    }
    this.getData = this.getData.bind(this)
    this.finish = this.finish.bind(this)
  }

  componentDidMount() {
    let query = common.searchToObj(this.props.location.search)
    this.setState(
      {
        planId: query.planId
      },
      function() {
        this.getData()
      }
    )
  }

  /* 获取数据 */
  getData() {
    clearInterval(this.state.timer)
    http.get(urls.EXAM_PLAN_PAPER, null, this.state.planId).then(res => {
      if (res) {
        this.setState(
          {
            paperData: res.body,
            surplusSeconds: res.body.surplusSeconds,
            list: this.dealList(res.body.exerciseTypes)
          },
          function() {
            this.dealTimer()
          }
        )
        let data = {
          courseName: res.body.courseName
        }
        localStorage.setItem('exam', JSON.stringify(data))
        this.props.dispatch(setExam(data))
      } else {
        this.setState({
          isShowCamera: false
        })
      }
    })
  }

  /* 处理倒计时 */
  dealTimer() {
    this.state.timer = setInterval(() => {
      if (this.state.surplusSeconds < 1) {
        this.postData()
        clearInterval(this.state.timer)

        Modal.warning({
          title: '考试已结束！',
          okText: '我知道了',
          content: (
            <div>
              <p>系统已为你自动交卷。</p>
            </div>
          ),
          onOk() {
            createHashHistory().push({
              pathname: 'examPlan'
            })
          }
        })
        return
      }
      //需要定时执行的方法
      let surplusSeconds = this.state.surplusSeconds - 1
      let lastTime = common.sec_to_time(surplusSeconds)
      this.setState({
        lastTime: lastTime,
        surplusSeconds: surplusSeconds
      })
    }, 1000)
  }

  /* 处理列表 */
  dealList(list) {
    list.forEach(ele => {
      ele.exercises.forEach(item => {
        item['hasAnswer'] = false
        if (item.exercisesCategory == 1) {
          let flag = _.find(item.choices, ['checked', true])
          if (flag) {
            item.hasAnswer = true
          }
        }
        if (item.exercisesCategory == 2) {
          if (item.answer) {
            item.hasAnswer = true
          }
        }
        if (item.exercisesCategory > 2) {
          let flag = this.isComplate(item.childExercises)
          if (flag) {
            item.hasAnswer = true
          } else {
            item.hasAnswer = false
          }
        }
      })
    })
    return list
  }

  /* 点击答题卡左侧滚动到指定题 */
  goView(view) {
    let element = document.getElementById(view)
    let scrollIntoViewOptions = {
      behavior: 'smooth' //滚动
    }
    element.scrollIntoView(scrollIntoViewOptions)
  }

  /* 点击了选项 */
  choice(ind, index, childIndex, checked) {
    let list = this.state.list
    let current = list[ind].exercises[index]
    /* 单选题 */
    if (!current.multipleChoice) {
      current.choices.forEach(item => {
        item.checked = false
      })
    }
    current.choices[childIndex].checked = !checked

    let flag = _.find(current.choices, ['checked', true])
    if (flag) {
      current.hasAnswer = true
    } else {
      current.hasAnswer = false
    }

    list[ind].exercises[index] = current

    let data = {
      choices: current.choices
    }
    this.choicePush(data, current, list)
  }

  /* 存在字题的题点击了选项 */
  hasChildChoice(ind, index, childIndex, choiceIndex, checked) {
    let list = this.state.list
    let current = list[ind].exercises[index]
    let currentChoice = current.childExercises[childIndex]
    /* 单选题 */
    if (!currentChoice.multipleChoice) {
      currentChoice.choices.forEach(item => {
        item.checked = false
      })
    }
    currentChoice.choices[choiceIndex].checked = !checked

    let flag = this.isComplate(current.childExercises)
    if (flag) {
      current.hasAnswer = true
    } else {
      current.hasAnswer = false
    }

    list[ind].exercises[index] = current

    let data = {
      childExercises: current.childExercises
    }
    this.choicePush(data, current, list)
  }

  /* 判断是否所有自题都做完了 */
  isComplate(data) {
    let flag = true
    data.forEach(item => {
      let checked = _.find(item.choices, ['checked', true])
      if (!checked) {
        flag = false
      }
    })
    return flag
  }

  /* 操作了选项提交给后台 */
  choicePush(data, current, list) {
    http
      .put(urls.EXAM_PLAN_ANSWER, data, this.state.planId, current.exercisesNo)
      .then(res => {
        if (res && res.body) {
          this.setState({
            list: list
          })
        }
      })
  }

  /* 简答题做了修改 */
  onChange = (ind, index, event) => {
    let list = this.state.list
    let current = list[ind].exercises[index]
    current.answer = event.target.value
    this.setState({ list: list })
    console.log(event.target.value, ind, index)
  }

  /* 主观题提交数据 */
  onBlur = (ind, index) => {
    let list = this.state.list
    let current = list[ind].exercises[index]
    let data = {
      answer: current.answer
    }
    if (current.answer) {
      current.hasAnswer = true
    } else {
      current.hasAnswer = false
    }
    http
      .put(urls.EXAM_PLAN_ANSWER, data, this.state.planId, current.exercisesNo)
      .then(res => {
        if (res && res.body) {
          this.setState({
            list: list
          })
        }
      })
  }

  /* 提交试卷 */
  finish() {
    let flag = this.checkPaper()
    console.log(flag)
    let tipText = '考试尚未结束，是否继续交卷？'
    if (!flag) {
      tipText = '还有未答的题目，是否继续交卷？'
    } else if (this.state.paperData.surplusSeconds) {
      tipText = '考试尚未结束，是否继续交卷？'
    }
    let that = this
    confirm({
      title: tipText,
      content: '请仔细检查试卷，核对题目与答案，一旦交卷无法撤回。',
      okText: '交卷',
      cancelText: '取消',
      onOk() {
        that.postData()
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }

  /* 判断是否所有题都答完了 */
  checkPaper() {
    let list = this.state.list
    let flag = true
    list.forEach(ele => {
      ele.exercises.forEach(item => {
        if (!item.hasAnswer) {
          flag = false
        }
      })
    })
    return flag
  }

  /* 提交试卷给后端 */
  postData() {
    http.put(urls.EXAM_PLAN_PAPER, null, this.state.planId).then(res => {
      if (res) {
        message.success('交卷成功')
        createHashHistory().push({
          pathname: 'examPlan'
        })
      }
    })
  }

  render() {
    const {
      paperData,
      list,
      loading,
      lastTime,
      isShowCamera,
      surplusSeconds
    } = this.state

    return (
      <div className="exam clearfix">
        {/* {isShowCamera ? <Camera /> : null} */}

        <div className="exam-right">
          <div className="card-main">
            {isShowCamera ? <Camera /> : null}
            <div className="exer-card-main scrollStyle">
              <div className="exer-card">答题卡</div>
              {list.map((ele, ind) => (
                <div className="card-item" key={ind}>
                  <div className="card-title">{ele.description}</div>
                  <div className="clearfix card-box">
                    {ele.exercises.map((item, index) => (
                      <span
                        className="card"
                        className={`card ${item.hasAnswer ? 'checked' : null}`}
                        key={index}
                        onClick={() => this.goView(`${ind + 1}-${index + 1}`)}
                      >
                        {index + 1}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="card-tips">
              <span className="card-tips-item clearfix">
                <span></span>已答
              </span>
              <span className="card-tips-item tips2 clearfix">
                <span></span>未答
              </span>
            </div>
          </div>
          <div className="exam-time">
            <span className="last-time">
              剩余时间:
              <span>{lastTime || 0}</span>
            </span>
            <Button
              key="submit"
              type="primary"
              disabled={
                paperData.examDuration - Math.floor(surplusSeconds / 60) < 30
              }
              loading={loading}
              onClick={this.finish}
            >
              {paperData.examDuration - Math.floor(surplusSeconds / 60) < 30
                ? '30分钟后可交卷'
                : '交卷'}
            </Button>
          </div>
        </div>

        <div className="exam-left">
          <div className="exam-title">
            {paperData.courseName}考试
            <span className="title-time">
              考试时间：{paperData.examDuration}分钟
            </span>
            <span className="title-score">满分：{paperData.fullScore}分</span>
          </div>
          <div className="exam-paper scrollStyle" ref="examPaper">
            {list.map((ele, ind) => (
              <div className="paper-item" key={ind}>
                <div className="big-title">{ele.description}</div>
                {/* 大题里面的小题 */}
                {ele.exercises.map((item, index) => (
                  <div className="little-exer" key={index}>
                    <div
                      className="description-tit"
                      id={`${ind + 1}-${index + 1}`}
                    >
                      <span>{index + 1}、</span>
                      <div
                        className="description"
                        dangerouslySetInnerHTML={{
                          __html: item.description
                        }}
                      ></div>
                    </div>
                    {/* 客观题 */}
                    {item.exercisesCategory == 1 ? (
                      <div className="clearfix">
                        {item.choices.map((child, childIndex) => (
                          <div
                            className="objective clearfix"
                            key={childIndex}
                            onClick={() =>
                              this.choice(ind, index, childIndex, child.checked)
                            }
                          >
                            <span
                              className={`choice ${
                                item.multipleChoice ? 'multiple' : ''
                              } ${child.checked ? 'checked' : null}`}
                            >
                              {child.choice}
                            </span>

                            <div
                              className={`choice-text ${
                                child.checked ? 'checked' : null
                              }`}
                              dangerouslySetInnerHTML={{
                                __html: child.description
                              }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    ) : /* 主观题 */
                    item.exercisesCategory == 2 ? (
                      <div className="subjective">
                        <Input.TextArea
                          rows={4}
                          placeholder="请输入你的答案（1000字内）"
                          value={item.answer}
                          onChange={this.onChange.bind(null, ind, index)}
                          onBlur={this.onBlur.bind(null, ind, index)}
                        />
                      </div>
                    ) : (
                      /* 完形填空或者阅读理解 */
                      <div className="childList">
                        {item.childExercises.map((child, childIndex) => (
                          <div
                            className="child-mian margin-T10"
                            key={childIndex}
                          >
                            <div className="description-tit">
                              <span>({childIndex + 1})、</span>
                              <div
                                className="description"
                                dangerouslySetInnerHTML={{
                                  __html: child.description
                                }}
                              ></div>
                            </div>

                            <div className="clearfix">
                              {child.choices.map((choiceItem, choiceIndex) => (
                                <div
                                  className="objective clearfix"
                                  key={choiceIndex}
                                  onClick={() =>
                                    this.hasChildChoice(
                                      ind,
                                      index,
                                      childIndex,
                                      choiceIndex,
                                      choiceItem.checked
                                    )
                                  }
                                >
                                  <span
                                    className={`choice  ${
                                      child.multipleChoice ? 'multiple' : ''
                                    } ${choiceItem.checked ? 'checked' : null}`}
                                  >
                                    {choiceItem.choice}
                                  </span>

                                  <div
                                    className={`choice-text ${
                                      choiceItem.checked ? 'checked' : null
                                    }`}
                                    dangerouslySetInnerHTML={{
                                      __html: choiceItem.description
                                    }}
                                  ></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

/*  {
    key: 1,
    value: '客观题'
  },
  {
    key: 2,
    value: '主观题'
  },
  {
    key: 3,
    value: '完形填空'
  },
  {
    key: 4,
    value: '阅读理解'
  } */

const mapStateToProps = state => ({
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(Exam)
