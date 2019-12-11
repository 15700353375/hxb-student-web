import React, { Component } from 'react';

import http from '../../utils/http';
import { urls } from '../../utils/api';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '我是login'
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
    return (
      <div>
        <h1>{this.state.msg}</h1>
      </div>
    );
  }
}
