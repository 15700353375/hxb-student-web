import React from 'react';
import { connect } from 'react-redux';
import '@assets/paper.scss';
class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="topic-block">
        <div className="tit">
          当前题目
          <span className="timer">
            论文初稿截止日期：
            {this.props.topic ? this.props.topic.firstDraftEndDatetime : ''}
          </span>
        </div>
        <div className="topic-tit">
          {this.props.topic ? this.props.topic.title : ''}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  topic: state.topic
});
export default connect(mapStateToProps)(Topic);
