import React from 'react'
import { Router } from 'react-router'
// import { Route, Switch, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history' // 是hash路由 history路由 自己根据需求来定
const history = createHashHistory()
import './App.css'
import moment from 'moment'
import qs from 'qs'
import _ from 'lodash'
import { Switch, Route } from 'react-router-dom'

import routes from './router'
import { setRoutes } from '@store/actions'
import store from './store/index.js'

window.Moment = moment
window.qs = qs
window._ = _
// 监听路由;
history.listen((location, action) => {
  store.dispatch(setRoutes(location))
  // 判断是否存在这个路由
  // let hasRoute = routes.findIndex(item => {
  //   return item.path == location.pathname;
  // });
  // if (!sessionStorage.getItem('sToken')) {
  //   createHashHistory().push('/login');
  // }
  // let sToken = sessionStorage.getItem('sToken');
  // if (location.pathname == '/login' && sToken) {
  //   createHashHistory().push('/main/home');
  // }
  routeInterception()
})

/* 路由拦截 */
function routeInterception() {
  // 判断是否有登录信息和确认注意事项  如果没有  跳转到登录页面  如果有 正常路由
  // let current = history.location.pathname;
  let sToken = sessionStorage.getItem('sToken')
  let userInfo = JSON.parse(localStorage.getItem('userInfo'))
  if (
    sToken &&
    userInfo &&
    userInfo.notesAck == true &&
    userInfo.mobileAck == true
  ) {
    if (location.pathname == '/login' || location.hash == '#/') {
      createHashHistory().push('/main/home')
    }
  } else {
    createHashHistory().push('/login')
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    routeInterception()
  }

  componentWillUpdate(nextProps) {}

  render() {
    return (
      <Router history={history}>
        <div className="app">
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
          {/* <Switch> */}
          {/* <HashRouter >{renderRoutes(routes)}</HashRouter> */}
          {/* {routes.map((item, index) => {
              // debugger;
              return (
                <Route
                  key={index}
                  path={item.path}
                  exact
                  render={props => <item.component {...props} />}
                />
              );
            })} */}
          {/* <Route path="/login" component={Login} />
            <Route path="/home" component={Home}>
              <div>
                <Route path="/home/paper" component={Paper} />
              </div>
            </Route> */}
          {/* // 所有错误路由跳转页面 */}
          {/* <Route component={NotFound} />
          </Switch> */}
        </div>
      </Router>
    )
  }
}

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => {
        return (
          // pass the sub-routes down to keep nesting
          <route.component {...props} routes={route.routes} />
        )
      }}
    />
  )
}
export default App
