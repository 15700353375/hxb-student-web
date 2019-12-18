/*
 * author: Arya
 * description: 确认手机号
 * time: 2019-12-12
 */
import React from 'react';
import { Button } from 'antd';
import http from '@utils/http';
import { urls } from '@utils/api';
import { createHashHistory } from 'history';
import { connect } from 'react-redux';
import { setUserInfo } from '@store/actions';
class Mobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.sureMobile = this.sureMobile.bind(this);
  }

  sureMobile() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.setState({
      loading: true
    });
    http.put(urls.MOBILE_ACK, null).then(res => {
      if (res) {
        userInfo.mobileAck = true;
        // createHashHistory().push('/main/home');
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.props.handleBindMobile(userInfo);
        this.props.dispatch(setUserInfo(userInfo));
      }
      this.setState({
        loading: false
      });
    });
  }

  render() {
    return (
      <div className="mobile comfirmMobile">
        <h2>确认手机号</h2>
        <div className="mobile-tips">
          为保障您及时接收通知，请确认您的手机号是否正确
        </div>
        <div className="mobile-text">{this.props.userInfo.mobile}</div>
        <Button
          block
          size="large"
          type="primary"
          className="ghost"
          ghost
          onClick={this.props.goBindMobile}
        >
          更改手机号
        </Button>
        <Button block size="large" type="primary" onClick={this.sureMobile}>
          确认手机号
        </Button>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
});
export default connect(mapStateToProps)(Mobile);
