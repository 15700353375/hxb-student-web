/*
 * @Author:      Arya
 * @DateTime:    2019-12-30
 * @Description: 公共方法
 */

import http from '@utils/http'
import { urls } from '@utils/api'
import { createHashHistory } from 'history' // 是hash路由 history路由 自己根据需求来定
const history = createHashHistory()
import { message } from 'antd'
import $ from 'jquery'
import store from '../store/index.js'
import { setUserInfo } from '@store/actions'
export default {
  /* 格式化search为对象 */
  searchToObj(data) {
    let search = data.split('?')
    return window.qs.parse(search[1])
  },
  // 格式化时间
  formatTime(time, type) {
    if (!time) {
      return
    }
    if (typeof time === 'string') {
      time = new Date(time).valueOf() / 1000
    }
    let typeFin = type || 'YYYY-MM-DD HH:mm'
    return window.Moment(time).format(typeFin)
  },

  /**
   * 秒转为时间
   * @param time 时间(00:00:00)
   * @returns {string} 时间戳（单位：秒）
   */
  sec_to_time(s) {
    var time = ''
    var day = Math.floor(s / 86400) || 0
    var hour = Math.floor(s / 3600) || 0
    var min = Math.floor((s % 3600) / 60) || 0
    var sec = (s % 3600) % 60 || 0

    hour = hour < 10 ? `0${hour}` : hour
    min = min < 10 ? `0${min}` : min
    sec = sec < 10 ? `0${sec}` : sec
    if (day) {
      time = `${day} ${hour}:${min}:${sec}`
    } else {
      time = `${hour}:${min}:${sec}`
    }

    return time
  },

  /* 上传文件 */
  upload(file) {
    return new Promise((resolve, reject) => {
      // 上传类型拦截
      var name = file.name
      var type = file.type
      let size = file.size // 文件的大小，判断图片的大小
      if (['image/jpeg', 'image/png', 'image/jpg'].indexOf(type) < 0) {
        message.error('请上传doc/请上传jpg、png、jpeg格式的图片!')
        reject(false)
        return
      }

      if (size > 5242880) {
        message.error('请选择5M以内的图片')
        reject(false)
        return
      }

      // 获取签名
      http.get(urls.GETOSSSIGNATURE).then(res => {
        if (res) {
          // let OSSData = res.body

          // if (!OSSData) return
          // let fileUrl =
          //   res.body.action + `/images/${new Date().getTime()}_` + file.name
          // resolve(fileUrl)
          let fileUrl = `images/${new Date().getTime()}_` + file.name

          var ossData = new FormData()
          ossData.append('OSSAccessKeyId', res.body.OSSAccessKeyId)
          ossData.append('policy', res.body.policy)
          ossData.append('Signature', res.body.Signature)
          ossData.append('key', fileUrl)
          ossData.append('file', file)
          $.ajax({
            url: res.body.action,
            type: 'POST',
            data: ossData,
            dataType: 'xml', // 这里加个对返回内容的类型指定
            processData: false, // 不需要进行序列化处理
            async: true, // 发送同步请求
            contentType: false, // 避免服务器不能正常解析文件
            filename: 'file',
            success: function(ret) {
              resolve(fileUrl)
            },
            error: function(xhr) {
              imgUrl = null
              reject(imgUrl)
              console.log('错误提示： ' + xhr.status + ' ' + xhr.statusText)
            }
          })
        } else {
          reject(false)
        }
      })
    })
  },

  /* 检测是否打开摄像头 */
  checkOpenCamera() {
    return new Promise((resolve, reject) => {
      // debugger
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // 标准的API
        var p = navigator.mediaDevices.getUserMedia({
          video: true
        })
        p.then(function(mediaStream) {
          message.success('摄像头可用')
          resolve(true)
        })
        p.catch(function(err) {
          message.error('请安装并打开摄像头')
          reject(false)
        })
      } else if (
        navigator.mediaDevices &&
        navigator.mediaDevices.webkitGetUserMedia
      ) {
        // WebKit
        // 标准的API
        var p = navigator.mediaDevices.webkitGetUserMedia({
          video: true
        })
        p.then(function(mediaStream) {
          message.success('摄像头可用')
          resolve(true)
        })
        p.catch(function(err) {
          message.error('请安装并打开摄像头')
          reject(false)
        })
      } else {
        message.error('请安装并打开摄像头')
        reject(false)
      }
    })
  },

  /* 退出登录 */
  loginOut() {
    sessionStorage.removeItem('sToken')
    localStorage.removeItem('userInfo')
    store.dispatch(setUserInfo(null))
    history.replace('/login')
  },

  /* 处理文件名 */
  dealUrl(url) {
    let newUrl = decodeURI(url)
    let t = newUrl.split('?')[0].split('/')
    let n = t[t.length - 1].split('_')
    return n[n.length - 1]
  }
}
