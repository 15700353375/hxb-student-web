/*
 * author: Arya
 * description: 绑定手机号
 * time: 2019-12-12
 */
import React from 'react'
import { Form, Input, Button } from 'antd'
import http from '@utils/http'
import { urls } from '@utils/api'
import verification from '@utils/verification'

import '@assets/login.scss'
import img_mobile from '@assets/img/mobile.png'
import img_code from '@assets/img/code.png'

import { connect } from 'react-redux'
import { setUserInfo } from '@store/actions'

let timers
class MobileBind extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      // 是否可点击获取验证码
      flag: true,
      timer: 60
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCode = this.getCode.bind(this)
    this.dealTime = this.dealTime.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  componentDidMount() {}
  componentWillUnmount() {
    clearInterval(timers)
  }

  /* 获取验证码 */
  getCode(e) {
    this.props.form.validateFields(['newMobile'], (err, values) => {
      if (!err) {
        http.post(urls.GETCODE, { mobile: values.newMobile }).then(res => {
          if (res) {
            this.dealTime()
          }
        })
      }
    })
  }

  dealTime() {
    this.setState({
      flag: false
    })
    timers = setInterval(() => {
      let timer = this.state.timer
      this.setState({
        timer: timer - 1
      })
      if (timer <= 0) {
        clearInterval(timers)
        this.setState({
          timer: 60,
          flag: true
        })
      }
    }, 1000)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          loading: true
        })
        http.put(urls.MOBILE_BIND, values).then(res => {
          if (res) {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'))
            userInfo.mobile = values.newMobile
            userInfo.mobileAck = true
            // 用户信息存在本地和redux
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            this.props.handleBindMobile(userInfo)
            this.props.dispatch(setUserInfo(userInfo))
            localStorage.removeItem('goChangeMobile')
          }
          this.setState({
            loading: false
          })
        })
      }
    })
  }

  goBack() {
    this.props.handleBindMobile()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const validator_mobile = verification.validator_mobile
    const validator_code = verification.validator_code
    return (
      <div className="mobile">
        <h2>绑定手机号</h2>
        <div className="mobile-tips">填写您的常用手机号</div>
        <Form onSubmit={this.handleSubmit} className="login-form login-content">
          <Form.Item>
            {getFieldDecorator('newMobile', {
              rules: [
                {
                  validator: validator_mobile
                }
              ],
              validateTrigger: 'onBlur'
            })(
              <Input
                prefix={<img src={img_mobile} />}
                placeholder="请输入手机号"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('code', {
              rules: [
                {
                  validator: validator_code
                }
              ],
              validateTrigger: 'onBlur'
            })(
              <Input
                className="code"
                prefix={<img src={img_code} />}
                placeholder="请输入验证码"
                addonAfter={
                  this.state.flag ? (
                    <a onClick={this.getCode}>获取验证码</a>
                  ) : (
                    <span>{this.state.timer}S后重新获取</span>
                  )
                }
              />
            )}
          </Form.Item>
          <Form.Item className="login-btn">
            <Button
              block
              size="large"
              type="primary"
              ghost
              className="login-form-button"
              onClick={this.goBack}
            >
              上一步
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={this.state.loading}
            >
              绑定
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const comp = connect()(MobileBind)
export default Form.create({ name: 'normal_mobile' })(comp)
