/*
 * @Author:      Arya
 * @DateTime:    2020-05-22
 * @Description: 选择批次弹窗
 */
import React from 'react'
import { Modal, Button } from 'antd'
import http from '@utils/http'
import { urls } from '@utils/api'
import '@assets/camera.scss'

class Camera extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      audioRef: null,
      num: 4,
      index: 1
    }
  }
  componentDidMount() {
    this.setState({
      audioRef: React.createRef()
    })
    this.start()
  }

  start() {
    var context = canvas.getContext('2d')
    if (navigator.mediaDevices.getUserMedia) {
      this.state.audioRef.current.play()
      // 标准的API
      var p = navigator.mediaDevices.getUserMedia({
        video: true
      })
      p.then(function(mediaStream) {
        console.log(mediaStream)

        var video = document.querySelector('video')
        video.srcObject = mediaStream
        video.onloadedmetadata = function(e) {
          // Do something with the video here.
          video.play()
        }
      })
      p.catch(function(err) {
        console.log(1, err.name)
        alert('不允许拍照将不能参加考试')
      })
    } else if (navigator.mediaDevices.webkitGetUserMedia) {
      // WebKit
      var p = navigator.mediaDevices.webkitGetUserMedia({
        video: true
      })
      p.then(function(mediaStream) {
        var video = document.querySelector('video')
        video.src = window.URL.createObjectURL(mediaStream)
        video.onloadedmetadata = function(e) {
          // Do something with the video here.
          video.play()
        }
      })
      p.catch(function(err) {
        console.log(2, err.name)
      })
    }
    let timer = setInterval(() => {
      if (this.state.index > this.state.num) {
        clearInterval(timer)
        return
      }
      context.drawImage(video, 0, 0, 640, 480)
      convertCanvasToImage(canvas)
      this.setState({
        index: this.state.index++
      })
    }, 5000)
  }

  convertCanvasToImage(canvas) {
    var image = new Image()
    image.src = canvas.toDataURL('image/png')
    console.log(image)
    imgBox.appendChild(image)
    return image
  }

  render() {
    return (
      <div clearfix>
        <video
          id="video"
          ref={this.audioRef}
          // autoplay={true}
          style="width:640px;height:480px;display:none;"
        ></video>
        <canvas
          style="display:none;"
          id="canvas"
          width="640"
          height="480"
        ></canvas>
        {/* <div id="imgBox"></div> */}
      </div>
    )
  }
}

export default Camera
