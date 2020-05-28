/*
 * @Author:      Arya
 * @DateTime:    2019-12-30
 * @Description: 公共方法
 */

import http from '@utils/http'
import { urls } from '@utils/api'
import { createHashHistory } from 'history' // 是hash路由 history路由 自己根据需求来定
const history = createHashHistory()
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

  /* 退出登录 */
  loginOut() {
    sessionStorage.removeItem('sToken')
    localStorage.removeItem('userInfo')
    store.dispatch(setUserInfo(null))
    history.push('/login')
  },

  /* 处理文件名 */
  dealUrl(url) {
    let newUrl = decodeURI(url)
    let t = newUrl.split('?')[0].split('/')
    let n = t[t.length - 1].split('_')
    return n[n.length - 1]
  }
}
