/*
 * @Author:      Arya
 * @DateTime:    2020-05-12
 * @Description: 省考首页-主页面
 */

import React, { Component } from 'react'
import '../../assets/login.scss'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import TopBar from '../main/topBar'

class Province extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {}

  render() {
    return (
      <div className="home">
        <TopBar />
        <div className="main clearfix">
          {/* <div className="clearfix"> */}
          <Switch>
            {this.props.routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
          {/* </div> */}
        </div>
      </div>
    )
  }
}

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => {
        return <route.component {...props} key={props} routes={route.routes} />
      }}
    />
  )
}

const mapStateToProps = state => ({
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(Province)
