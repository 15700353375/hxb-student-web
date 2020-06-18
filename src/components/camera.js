/*
 * @Author:      Arya
 * @DateTime:    2020-05-22
 * @Description: 选择批次弹窗
 */
import React from 'react'
import { message } from 'antd'
import { connect } from 'react-redux'
import common from '@utils/common'
import http from '@utils/http'
import { urls } from '@utils/api'
import '@assets/camera.scss'
class Camera extends React.Component {
  constructor(props) {
    super(props)
    this.canvas = React.createRef()
    this.canvas = null
    this.state = {
      planId: null,
      timer: null
    }
  }
  componentDidMount() {
    let query = common.searchToObj(this.props.currentRoute.search)
    this.setState({
      planId: query.planId
    })

    setTimeout(() => {
      if (this.canvas) {
        let canvas = this.canvas
        this.start(canvas)
      }
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.state.timer)
  }

  start(canvas) {
    var context = canvas.getContext('2d')
    var video = this.refs.video
    if (navigator.mediaDevices.getUserMedia) {
      // 标准的API
      var p = navigator.mediaDevices.getUserMedia({
        video: true
      })
      let that = this
      p.then(function(mediaStream) {
        video.srcObject = mediaStream
        video.onloadedmetadata = function(e) {
          video.play()

          setTimeout(() => {
            context.drawImage(video, 0, 0, 400, 300)
            that.convertCanvasToImage(canvas)
          }, 1000)
        }
        that.takePhoto(context, canvas, video)
      })
      p.catch(function(err) {
        message.error('请安装并打开摄像头')
        return
      })
    } else if (navigator.mediaDevices.webkitGetUserMedia) {
      // WebKit
      // 标准的API
      var p = navigator.mediaDevices.webkitGetUserMedia({
        video: true
      })
      let that = this
      p.then(function(mediaStream) {
        video.srcObject = mediaStream
        video.onloadedmetadata = function(e) {
          video.play()
          setTimeout(() => {
            context.drawImage(video, 0, 0, 400, 300)
            that.convertCanvasToImage(canvas)
          }, 1000)
        }
        that.takePhoto(context, canvas, video)
      })
      p.catch(function(err) {
        message.error('请安装并打开摄像头')
        return
      })
    }
  }

  /* 定时拍照 */
  takePhoto(context, canvas, video) {
    this.state.timer = setInterval(() => {
      context.drawImage(video, 0, 0, 400, 300)
      this.convertCanvasToImage(canvas)
    }, 480000)
  }

  convertCanvasToImage(canvas) {
    let src = canvas.toDataURL('image/png')
    let file = this.dataURLtoFile(src, `${this.props.userInfo.name}.png`)
    common.upload(file).then(
      res => {
        this.postImage(res)
      },
      err => {
        message.error('图片上传失败')
      }
    )
  }

  /* base64图片转化为文件 */
  dataURLtoFile(dataurl, filename) {
    //将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  /* 提交数据给后台 */
  postImage(fileUrl) {
    let params = {
      pic: fileUrl
    }
    http.put(urls.EXAM_PLAN_PICTURE, params, this.state.planId).then(res => {
      if (res) {
        console.log('上传成功')
      }
    })
  }

  render() {
    return (
      <div className="camera-main">
        <video ref="video" width="200" height="150" autoPlay></video>
        <canvas
          className="diaplayNone"
          ref={node => (this.canvas = node)}
          width="400"
          height="300"
        ></canvas>
        <div className="camera-tips">
          <div className="tits">实时监控中</div>
          <div className="content">
            请勿遮挡脸部，确保您的正脸在拍摄画面范围内！
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  currentRoute: state.currentRoute
})

export default connect(mapStateToProps)(Camera)
