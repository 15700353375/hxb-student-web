import React, { Component } from 'react';
import '../../assets/login.scss';
import http from '../../utils/http';
import { urls } from '../../utils/api';
import { connect } from 'react-redux';
import store from '@store';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import src from '../../assets/img/login.png';
import { Switch, Route } from 'react-router-dom';

import TopBar from './topBar';
import SideBar from './sidebar';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '我是home'
    };
    this.getData = this.getData.bind(this);
  }
  componentDidMount() {
    // this.getData();
    let data = store.getState();
    console.log(this.props, data);
    // debugger;
  }

  getData() {
    let data = {
      idCard: '510304199110301510',
      password: '301510'
    };
    http.postJson(urls.LOGIN, data).then(res => {
      if (res) {
        debugger;
      }
    });
  }
  render() {
    return (
      <div className="home">
        <TopBar />
        <div className="main clearfix">
          <div className="content">
            <Switch>
              {this.props.routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
              ))}
            </Switch>
          </div>
          <SideBar />
        </div>
      </div>
    );
  }
}

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => {
        return (
          // pass the sub-routes down to keep nesting
          <route.component {...props} key={props} routes={route.routes} />
        );
      }}
    />
  );
}

const mapStateToProps = state => ({
  userInfo: state.userInfo
});

export default connect(mapStateToProps)(Main);
