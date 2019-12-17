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
import { setUserInfo } from '@store/actions';

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
      isEdit: false
    };

  }
  componentWillMount() {
    console.log(this.props);
  }


  render() {
    return (
      <div className="addPaper">
        <PaperStatus />
        {/* <Topic /> */}
        <div>
          {/* <UpPaper /> */}
        </div>
        <UploadHistory/>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
});
export default connect(mapStateToProps)(Paper);
