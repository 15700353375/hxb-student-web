/*
 * @Author:      Arya
 * @DateTime:    2020-06-12
 * @Description: 摄像头测试
 */
import React from 'react'
import { Modal, Button, message } from 'antd'
import { connect } from 'react-redux'
import '@assets/testCamera.scss'
class TestCamera extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      hasCamera: true,
      index: 0
    }
    this.start = this.start.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }
  componentDidMount() {
    // setTimeout(() => {
    //   this.start()
    // }, 1000)
  }

  start() {
    this.setState({
      index: this.state.index + 1
    })
    var video = this.refs.video
    if (navigator.mediaDevices.getUserMedia) {
      // 标准的API
      let that = this

      var p = navigator.mediaDevices.getUserMedia({
        video: true
      })
      p.then(function(mediaStream) {
        video.srcObject = mediaStream
        video.onloadedmetadata = function(e) {
          video.play()
        }
        that.setState({
          hasCamera: true
        })
      })
      p.catch(function(err) {
        that.setState({
          hasCamera: false
        })
        message.error('请安装并打开摄像头')
        return
      })
    } else if (navigator.mediaDevices.webkitGetUserMedia) {
      // WebKit
      // 标准的API
      let that = this

      var p = navigator.mediaDevices.webkitGetUserMedia({
        video: true
      })
      p.then(function(mediaStream) {
        video.srcObject = mediaStream
        video.onloadedmetadata = function(e) {
          video.play()
        }
        that.setState({
          hasCamera: true
        })
      })
      p.catch(function(err) {
        that.setState({
          hasCamera: false
        })
        message.error('请安装并打开摄像头')
        return
      })
    }
  }

  handleCancel() {
    this.setState({
      visible: false
    })
    this.props.closeModal()
  }
  render() {
    const { visible, hasCamera, index } = this.state
    return (
      <Modal
        title="摄像头测试"
        centered
        width={468}
        visible={visible}
        onOk={this.handleCancel}
        onCancel={this.handleCancel}
        footer={null}
      >
        <div className="text-center btn-main marginB-30">
          <Button size="large" type="primary" onClick={this.start}>
            {index > 0 ? '重新' : '开始'}测试
          </Button>
        </div>
        <div className="video-main">
          <video ref="video" width="420" height="300" autoPlay></video>
          {hasCamera ? null : <span>摄像头调取失败！</span>}
        </div>
        {hasCamera ? null : (
          <div className="camera-error">
            <div className="err-tit">请检查是否存在以下问题：</div>
            <div className="err-con">
              1、Windows隐私设置中打开【允许桌面应用访问你的相机】；
              <br />
              2、浏览器设置中打开摄像头权限。
            </div>
          </div>
        )}
      </Modal>
    )
  }
}

export default connect()(TestCamera)
