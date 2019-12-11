import React, { Component } from 'react';
import '../../assets/login.scss';
import http from '../../utils/http';
import { urls } from '../../utils/api';

import { Form, Icon, Input, Button, Checkbox } from 'antd';
import src from '../../assets/img/login.png';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '我是home'
    };
    this.getData = this.getData.bind(this);
  }
  componentDidMount() {
    // this.getData();
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
    return <div className="home">{this.state.msg}</div>;
  }
}
