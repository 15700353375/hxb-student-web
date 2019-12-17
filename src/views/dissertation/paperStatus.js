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
// import { createHashHistory } from 'history';
import http from '@utils/http';
import { urls } from '@utils/api';
import verification from '@utils/verification';

// connect方法的作用：将额外的props传递给组件，并返回新的组件，组件在该过程中不会受到影响
import { connect } from 'react-redux';
import { setTopic } from '@store/actions';

import '@assets/chooseTopic.scss';
import waitUrl from '@assets/img/wait.png';
import noPassUrl from '@assets/img/noPass.png';
import passUrl from '@assets/img/pass.png';
import qqUrl from '@assets/img/qq.png';
import phoneUrl from '@assets/img/phone.png';

class PaperStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      thesisSupervisionTeacher: {
          name: '张三',
          mobile: 15700353375,
          qq: 1154818557
      },
      topic: {}
    };
    this.getData = this.getData.bind(this);
    this.getTeacher = this.getTeacher.bind(this);
    this.editOutLine = this.editOutLine.bind(this);
  }

  componentDidMount() {
    // this.getTeacher();
    // this.getData();
  }

  getTeacher() {
    http.get(urls.PAPER_TEACHER).then(res => {
      if (res) {
        this.setState({
          thesisSupervisionTeacher: res.body.thesisSupervisionTeacher
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
      }
    });
  }

  editOutLine() {
    this.props.handleChoose(true);
  }

  render() {
    let userInfo = {
      majorName: ''
    };
    userInfo = this.props.userInfo || userInfo;
    let thesisSupervisionTeacher = this.state.thesisSupervisionTeacher;
    // let topic = this.state.topic;
    let topic = {
        status: 1,
        statusShow: '待审核',
        firstDraftEndDatetime: '2019-12-30'
    }
    let url = waitUrl;
    if (topic.status == 0) {
      url = waitUrl;
    } else if (topic.status == 1) {
      url = noPassUrl;
    } else if (topic.status == 2) {
      url = passUrl;
    }
    return (
      <div className="topicStatus">
        <div className="topicStatus-top">
          <div className="topic-top clearfix">
            <img src={url} />
            <span className={`topic-status status${topic.status}`}>
              {topic.statusShow}
            </span>
            <span className="timer">
              提交日期：{topic.firstDraftEndDatetime}
            </span>
          </div>
          <div className="user-block-bottom clearfix">
            <div className="teacher-name">
              <div>我的指导老师: {thesisSupervisionTeacher.name}</div>
            </div>
            <div className="teacher-mobile">
              <img src={phoneUrl} alt="home" />
              {thesisSupervisionTeacher.mobile}
            </div>
            <div className="teacher-mobile">
              <img src={qqUrl} alt="home" />
              {thesisSupervisionTeacher.qq}
            </div>
          </div>
          {topic.status == 1 ? (
            <div className="reason">
              <div className="clearfix">
                <div className="reason-tit">原因：</div>
                <div className="reason-content text-ellipsis2">
                  {topic.noPassReason}
                </div>
              </div>
              <div className="text-right margin-T20">
                <Button
                  type="primary"
                  className="margin-R20"
                  ghost
                  onClick={this.props.handleChoose}
                >
                  重新选题
                </Button>
                <Button type="primary" ghost onClick={this.editOutLine}>
                  编辑大纲
                </Button>
              </div>
            </div>
          ) : null}
        </div>
        <div className="topicStatus-content">
          <div className="tit">当前题目</div>
          <div className="topic-title">{topic.title}</div>
          <div className="tit">大纲</div>
          <div className="topic-content">{topic.outline}</div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
});
export default connect(mapStateToProps)(PaperStatus);
