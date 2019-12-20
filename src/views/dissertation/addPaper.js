/*
 * author: Arya
 * description: 上传论文
 * time: 2019-12-17
 */
import React from 'react';
import { Form, Input, Button, Select, message, Modal } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
import { createHashHistory } from 'history';
import http from '@utils/http';
import { urls } from '@utils/api';
import verification from '@utils/verification';

// connect方法的作用：将额外的props传递给组件，并返回新的组件，组件在该过程中不会受到影响
import { connect } from 'react-redux';

import '@assets/paper.scss';
import Topic from './topic';
import UpPaper from './upPaper';

class AddPaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      topicList: [],
      topic: {},
      isEdit: false
    };
    this.upSuccess = this.upSuccess.bind(this);
    // this.getData = this.getData.bind(this);
    // this.handleChoose = this.handleChoose.bind(this);
    // this.chooseSuccess = this.chooseSuccess.bind(this);
  }
  componentWillMount() {
    console.log(this.props);
    // let { setUserInfo } = this.props;
    // this.getData();
  }

  // getData() {
  //   http.get(urls.PAPER_STEP).then(res => {
  //     if (res) {
  //       this.setState({
  //         topic: res.body.steps[0]
  //       });
  //     }
  //   });
  // }

  // handleChoose(data) {
  //   let topic = this.state.topic;
  //   topic.status = 0;
  //   this.setState({
  //     isEdit: data,
  //     topic
  //   });
  // }
  // chooseSuccess() {
  //   debugger;
  //   let topic = this.state.topic;
  //   topic.status = 1;
  //   this.setState({
  //     topic,
  //     isEdit: false
  //   });
  // }

  upSuccess() {
    createHashHistory().push('/main/paper');
  }

  render() {
    return (
      <div className="addPaper">
        <Topic />
        <div>
          <UpPaper upSuccess={this.upSuccess} />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
});
export default connect(mapStateToProps)(AddPaper);
