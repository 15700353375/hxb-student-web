/*
 * author: Arya
 * description: 上传论文
 * time: 2019-12-17
 */
import React from 'react';
import { Form, Input, Button, Select, message, Modal } from 'antd';
import http from '@utils/http';
import { urls } from '@utils/api';

// connect方法的作用：将额外的props传递给组件，并返回新的组件，组件在该过程中不会受到影响
import { connect } from 'react-redux';
import { setTopic } from '@store/actions';

import '@assets/paper.scss';
import BasicInfo from './basicInfo';
import Question from './question';
import Upfile from './upfile';
import Answer from './answer';
// import UploadHistory from './uploadHistory';
class Defence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      topicList: [],
      topic: {},
      templateUrl: [],
      hasAnswer: false
    };
    this.getTemplate = this.getTemplate.bind(this);
    this.upSuccess = this.upSuccess.bind(this);
    this.getData = this.getData.bind(this);
  }
  componentWillMount() {
    this.getTemplate();
    if (this.props.topic) {
      if (this.props.topic.onlineDefenseDownUrl) {
        this.setState({
          hasAnswer: true
        });
      }
    }
  }

  getTemplate() {
    http.get(urls.PAPER_DOWNLOAD).then(res => {
      if (res) {
        this.setState({
          templateUrl: [res.body.files[4].value, res.body.files[5].value]
        });
      }
    });
  }

  getData() {
    http.get(urls.PAPER_TOPIC).then(res => {
      if (res) {
        this.setState({
          topic: res.body
        });
        localStorage.setItem('topic', JSON.stringify(res.body));
        this.props.dispatch(setTopic(res.body));
        if (res.body.onlineDefenseDownUrl) {
          this.setState({
            hasAnswer: true
          });
        }
      }
    });
  }

  upSuccess() {
    this.setState({
      hasAnswer: true
    });
    this.getData();
  }

  render() {
    let comp;
    if (this.state.hasAnswer) {
      comp = <Answer templateUrl={this.state.templateUrl} />;
    } else {
      comp = (
        <Upfile
          upSuccess={this.upSuccess}
          templateUrl={this.state.templateUrl}
        />
      );
    }
    return (
      <div className="addPaper">
        <BasicInfo />
        <Question />
        {comp}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo,
  topic: state.topic
});
export default connect(mapStateToProps)(Defence);
