import React from 'react';
import { connect } from 'react-redux';
import '@assets/defence.scss';
import qqUrl from '@assets/img/qq.png';
import phoneUrl from '@assets/img/phone.png';
import wordUrl from '@assets/img/word.png';
import http from '@utils/http';
import { urls } from '@utils/api';
class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thesisSupervisionTeacher: {
        name: '',
        mobile: '',
        qq: ''
      }
    };
    this.getTeacher = this.getTeacher.bind(this);
  }

  componentDidMount() {
    this.getTeacher();
    // this.getData();
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
  render() {
    let thesisSupervisionTeacher = this.state.thesisSupervisionTeacher;
    return (
      <div className="basicInfo">
        <div className="basicInfo-teacher clearfix">
          我的指导老师: {thesisSupervisionTeacher.name}
          <img src={phoneUrl} alt="home" />
          {thesisSupervisionTeacher.mobile}
          <img src={qqUrl} alt="home" />
          {thesisSupervisionTeacher.qq}
          <span className="timer">
            网上答辩截止日期：{this.props.topic.firstDraftEndDatetime}
          </span>
        </div>
        <div className="basicInfo-block">
          <div className="tit">当前题目</div>
          <div className="topic-tit">
            {this.props.topic ? this.props.topic.title : ''}
          </div>
        </div>
        <div className="basicInfo-block">
          <div className="tit">当前题目定稿文件</div>
          <div className="topic-file">
            <img src={wordUrl} />
            <span>(文件名)</span>
            <a
              download={this.props.topic.finalDraftDownUrl}
              href={this.props.topic.finalDraftDownUrl}
            >
              下载
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  topic: state.topic
});
export default connect(mapStateToProps)(BasicInfo);
