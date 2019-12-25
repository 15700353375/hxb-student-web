/*
 * author: Arya
 * description: 选题主页
 * time: 2019-12-12
 */
import React from 'react';
import http from '@utils/http';
import { urls } from '@utils/api';

// connect方法的作用：将额外的props传递给组件，并返回新的组件，组件在该过程中不会受到影响
import { connect } from 'react-redux';
import { setTopic } from '@store/actions';

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
      isEdit: false,
      showOldTopic: false
    };
    this.getData = this.getData.bind(this);
    this.handleChoose = this.handleChoose.bind(this);
    this.chooseSuccess = this.chooseSuccess.bind(this);
  }
  componentWillMount() {
    this.getData();

    if (
      this.props.topic &&
      this.props.topic.title &&
      !this.props.topic.outline
    ) {
      this.setState({
        isEdit: true
      });
    }
  }

  getData() {
    http.get(urls.PAPER_TOPIC).then(res => {
      if (res) {
        localStorage.setItem('topic', JSON.stringify(res.body));
        this.props.dispatch(setTopic(res.body));
        if (!this.props.topic.outline) {
          res.body.status = null;
        }
        this.setState({
          topic: res.body
        });
      }
    });
  }

  handleChoose(data) {
    let topic = this.state.topic;
    topic.status = null;
    this.setState({
      isEdit: data,
      topic
    });
  }
  chooseSuccess() {
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
      if (topic.status == null) {
        comp = <ChooseTopic edit={isEdit} chooseSuccess={this.chooseSuccess} />;
      } else {
        comp = <TopicStatus handleChoose={this.handleChoose} />;
      }
    }
    return <div className="topic">{comp}</div>;
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo,
  topic: state.topic
});
export default connect(mapStateToProps)(Topic);
