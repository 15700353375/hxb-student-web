/*
 * author: Arya
 * description: 登录页面
 * time: 2019-12-12
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
import { setUserInfo } from '@store/actions';

import '@assets/chooseTopic.scss';
import ChooseTopic from './chooseTopic';
import TopicStatus from './topicStatus';

class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      topicList: [],
      topic: {},
      isEdit: false
    };
    this.getData = this.getData.bind(this);
    this.handleChoose = this.handleChoose.bind(this);
    this.chooseSuccess = this.chooseSuccess.bind(this);
  }
  componentWillMount() {
    console.log(this.props);
    // let { setUserInfo } = this.props;
    this.getData();
  }

  getData() {
    http.get(urls.PAPER_STEP).then(res => {
      if (res) {
        this.setState({
          topic: res.body.steps[0]
        });
      }
    });
  }

  handleChoose(data) {
    let topic = this.state.topic;
    topic.status = 0;
    this.setState({
      isEdit: data,
      topic
    });
  }
  chooseSuccess() {
    debugger;
    let topic = this.state.topic;
    topic.status = 1;
    this.setState({
      topic,
      isEdit: false
    });
  }

  render() {
    let comp;
    let topic = this.state.topic;
    let isEdit = this.state.isEdit;
    if (topic) {
      if (topic.status == 0) {
        comp = <ChooseTopic edit={isEdit} chooseSuccess={this.chooseSuccess} />;
      } else {
        comp = <TopicStatus handleChoose={this.handleChoose} />;
      }
    }
    return <div className="topic">{comp}</div>;
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
});
export default connect(mapStateToProps)(Topic);
