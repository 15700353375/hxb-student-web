import React from 'react';
import http from '@utils/http';
import { urls } from '@utils/api';
import '@assets/defence.scss';
export default class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
    this.getData = this.getData.bind(this);
  }
  componentDidMount() {
    this.getData();
  }

  getData() {
    http.get(urls.ANSWER_QUESTION).then(res => {
      if (res) {
        this.setState({
          list: res.body
        });
      }
    });
  }

  render() {
    let list = this.state.list;
    return (
      <div className="basicInfo margin-T20">
        <div className="basicInfo-block">
          <div className="tit tit2">问题详情</div>
          {list.map((item, index) => (
            <div className="topic-tit margin-T20 clearfix" key={index}>
              <div className="question-index">问题{index + 1}:</div>
              <div className="question-content">{item}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
