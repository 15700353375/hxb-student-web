import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import '@assets/defence.scss';
import wordUrl from '@assets/img/word.png';
import http from '@utils/http';
import { urls } from '@utils/api';
import common from '@utils/common';
class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getTeacher = this.getTeacher.bind(this);
    this.downLoad = this.downLoad.bind(this);
  }

  componentDidMount() {
    // this.getTeacher();
    // this.getData();
  }

  downLoad() {
    let alink = document.createElement('a');
    alink.download = '答辩模板'; //文件名,大部分浏览器兼容,IE10及以下不兼容
    alink.href = this.props.answerTemplateUrl;
    alink.click(); //自动点击
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
  render() {
    return (
      <div className="basicInfo margin-T20">
        <div className="basicInfo-block">
          <div className="tit tit2">
            答辩稿上传
            <Button type="primary" ghost onClick={this.downLoad}>
              下载答辩模板
            </Button>
          </div>
          <div className="topic-file">
            <img src={wordUrl} />
            <span>
              ({common.dealUrl(this.props.topic.onlineDefenseDownUrl)})
            </span>
            <a
              download={this.props.topic.onlineDefenseDownUrl}
              href={this.props.topic.onlineDefenseDownUrl}
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
export default connect(mapStateToProps)(Answer);
