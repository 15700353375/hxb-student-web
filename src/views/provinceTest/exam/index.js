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
import { createHashHistory } from 'history'
import { Input, Button, Modal, message } from 'antd'
const { confirm } = Modal

class Exam extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
      }
    })
  }

  /* 处理倒计时 */
  dealTimer() {
    this.state.timer = setInterval(() => {
      // debugger
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
        if (res) {
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
        if (res) {
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
    } else if (this.state.paperData.examDuration) {
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
    const { paperData, list, loading, lastTime } = this.state

    return (
      <div className="exam clearfix">
        <div className="exam-right">
          <div className="card-main">
            <div className="exer-card-main scrollStyle">
              <div className="exer-card">答题卡</div>
              {list.map((ele, index) => (
                <div className="card-item" key={index}>
                  <div className="card-title">{ele.description}</div>
                  <div className="clearfix card-box">
                    {ele.exercises.map((item, index) => (
                      <span
                        className="card"
                        className={`card ${item.hasAnswer ? 'checked' : null}`}
                        key={index}
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
              <span>{lastTime}</span>
            </span>
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.finish}
            >
              交卷
            </Button>
          </div>
        </div>

        <div className="exam-left">
          <div className="exam-title">
            高级财务会计考试
            <span className="title-time">
              考试时间：{paperData.examDuration}分钟
            </span>
            <span className="title-score">满分：{paperData.fullScore}分</span>
          </div>
          <div className="exam-paper scrollStyle">
            {list.map((ele, ind) => (
              <div className="paper-item" key={ind}>
                <div className="big-title">{ele.description}</div>
                {/* 大题里面的小题 */}
                {ele.exercises.map((item, index) => (
                  <div className="little-exer" key={index}>
                    <div className="description-tit">
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
                          <div className="objective clearfix" key={childIndex}>
                            <span
                              className={`choice ${
                                item.multipleChoice ? 'multiple' : ''
                              } ${child.checked ? 'checked' : null}`}
                              onClick={() =>
                                this.choice(
                                  ind,
                                  index,
                                  childIndex,
                                  child.checked
                                )
                              }
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
                                >
                                  <span
                                    className={`choice  ${
                                      child.multipleChoice ? 'multiple' : ''
                                    } ${choiceItem.checked ? 'checked' : null}`}
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
