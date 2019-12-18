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
import PaperStatus from './paperStatus';
import UploadHistory from './uploadHistory';
class Paper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      topicList: [],
      topic: {},
      showAddPaper: false,
      refresh: false
    };
    this.addUpComp = this.addUpComp.bind(this);
    this.upSuccess = this.upSuccess.bind(this);
  }
  componentWillMount() {}

  addUpComp() {
    this.setState({
      showAddPaper: true
    });
  }

  upSuccess() {
    this.child.getData();
    this.child2.getData();
    this.setState({
      showAddPaper: false
    });
  }

  onRef = ref => {
    this.child = ref;
  };
  onRefeash = ref => {
    this.child2 = ref;
  };

  render() {
    let comp;
    if (this.state.showAddPaper) {
      comp = <UpPaper upSuccess={this.upSuccess} />;
    }
    return (
      <div className="addPaper">
        <PaperStatus
          addUpComp={this.addUpComp}
          onRefeash={this.onRefeash.bind(this)}
        />
        <div className="margin-T20">
          <Topic />
        </div>
        {comp}
        <UploadHistory onRef={this.onRef.bind(this)} />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
});
export default connect(mapStateToProps)(Paper);
