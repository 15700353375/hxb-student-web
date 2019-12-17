import React, { Component } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import '@assets/home.scss';
import http from '../../utils/http';
import { urls } from '../../utils/api';
import { connect } from 'react-redux';
import homeUrl from '@assets/img/home.png';
import store from '@store';
import { createHashHistory } from 'history'; // 是hash路由 history路由 自己根据需求来定
const history = createHashHistory();
import common from '@utils/common';
class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoute: ''
    };
    this.goHome = this.goHome.bind(this);
    this.loginOut = this.loginOut.bind(this);
    store.subscribe(() => {
      console.log('state状态改变了，新状态如下');
      console.log(store.getState());
      let state = store.getState();
      this.setState({
        currentRoute: state.currentRoute
      });
    });
  }
  componentDidMount() {
    this.setState({
      currentRoute: this.props.currentRoute
    });
  }

  goHome() {
    createHashHistory().push('/main/home');
  }
  loginOut() {
    common.loginOut();
  }

  render() {
    let userInfo = {
      name: ''
    };
    userInfo = this.props.userInfo || userInfo;
    let leftComp;
    let currentRoute = this.state.currentRoute;
    if (currentRoute && currentRoute.pathname != '/main/home') {
      leftComp = (
        <div className="topbar-home" onClick={this.goHome}>
          <img src={homeUrl} className="topbar-icon-home" alt="home" />
          <span>首页</span>
        </div>
      );
    }
    const menu = (
      <Menu>
        <Menu.Item>
          <a rel="noopener noreferrer" onClick={this.loginOut}>
            退出
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="topbar">
        {leftComp}
        <span className="topbar-title">论文管理系统</span>
        <div className="topbar-user">
          <img className="topbar-icon-home" alt="home" />
          {/* <span>{userInfo.name}</span> */}
          <Dropdown overlay={menu} placement="bottomRight">
            <span>{userInfo.name}</span>
          </Dropdown>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  currentRoute: state.currentRoute
});

export default connect(mapStateToProps)(TopBar);
