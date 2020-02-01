/*
 * author: Arya
 * description: 论文结果
 * time: 2019-12-12
 */
import React from 'react';
import http from '@utils/http';
import { urls } from '@utils/api';

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
        name: '',
        mobile: '',
        qq: ''
      },
      topic: {}
    };
    this.getData = this.getData.bind(this);
    this.getTeacher = this.getTeacher.bind(this);
  }

  componentDidMount() {
    this.props.onRefeash(this);
    this.getTeacher();
    this.getData();
  }

  getTeacher() {
    http.get(urls.PAPER_TEACHER).then(res => {
      if (res) {
        this.setState({
          thesisSupervisionTeacher:
            res.body.thesisSupervisionTeacher ||
            this.state.thesisSupervisionTeacher
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
        // 如果是审核不通过，告诉父组件去显示上传论文的组件
        if (res.body.paperStatus == 2 || res.body.paperStatus == 4) {
          this.props.addUpComp();
        }
      }
    });
  }

  render() {
    let userInfo = {
      majorName: ''
    };
    userInfo = this.props.userInfo || userInfo;
    let thesisSupervisionTeacher = this.state.thesisSupervisionTeacher;
    let topic = this.state.topic;

    // 0待提交 1待审核  2驳回 3审核通过 4不通过
    let url = waitUrl;
    let status = 0;
    if (topic.paperStatus <= 1) {
      url = waitUrl;
      status = 0;
    } else if (topic.paperStatus == 2 || topic.paperStatus == 4) {
      url = noPassUrl;
      status = 1;
    } else if (topic.paperStatus == 3) {
      url = passUrl;
      status = 2;
    }

    return (
      <div className="topicStatus">
        <div className="topicStatus-top">
          <div className="topic-top clearfix">
            <img src={url} />
            <span className={`topic-status status${status}`}>
              {topic.paperStatusShow}
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
          {status == 1 ? (
            <div className="reason">
              <div className="clearfix">
                <div className="reason-tit paper-reason-tit">修改意见：</div>
                <div className="reason-content paper-reason-content">
                  {topic.paperAdvice}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
});
export default connect(mapStateToProps)(PaperStatus);
