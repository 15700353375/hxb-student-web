/*
 * @Author:      Arya
 * @DateTime:    2019-12-30
 * @Description: redux reducers
 */

// 工具函数，用于组织多个reducer，并返回reducer集合
import { combineReducers } from 'redux'
// 默认值
import defaultState from './state.js'

// 一个reducer就是一个函数
function userInfo(state = defaultState.userInfo, action) {
  // 不同的action有不同的处理逻辑
  switch (action.type) {
    case 'SET_USERINFO':
      return action.userInfo
    default:
      return state
  }
}
// 一个reducer就是一个函数
function currentRoute(state = defaultState.currentRoute, action) {
  // 不同的action有不同的处理逻辑
  switch (action.type) {
    case 'SET_ROUTES':
      return action.currentRoute
    default:
      return state
  }
}

// 一个reducer就是一个函数
function topic(state = defaultState.topic, action) {
  // 不同的action有不同的处理逻辑
  switch (action.type) {
    case 'SET_TOPIC':
      return action.topic
    default:
      return state
  }
}

// 一个reducer就是一个函数
function exam(state = defaultState.exam, action) {
  // 不同的action有不同的处理逻辑
  switch (action.type) {
    case 'SET_EXAM':
      return action.exam
    default:
      return state
  }
}
// 导出所有reducer
export default combineReducers({
  userInfo,
  currentRoute,
  topic,
  exam
})
