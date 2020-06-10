/*
 * @Author:      Arya
 * @DateTime:    2020-06-05
 * @Description: 倒计时
 */
import React from 'react'
import common from '@utils/common'
import '@assets/examPlan.scss'
export default class Countdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // surplusSeconds: null,
      timer: null,
      lastTime: null
    }
  }
  componentDidMount() {
    // 传入参数
    this.setState(
      {
        surplusSeconds: this.props.surplusSeconds
      },
      function() {
        this.dealTimer()
      }
    )
  }
  /* 处理倒计时 */
  dealTimer() {
    this.state.timer = setInterval(() => {
      if (!this.state.surplusSeconds || this.state.surplusSeconds < 1) {
        this.props.timeOver()
        clearInterval(this.state.timer)
        this.setState({
          lastTime: 0
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

  render() {
    return <span className="countdown">{this.state.lastTime || ''}</span>
  }
}
