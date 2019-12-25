/*
 * author: Arya
 * description: 上传论文
 * time: 2019-12-17
 */
import React from 'react';
import { createHashHistory } from 'history';

// connect方法的作用：将额外的props传递给组件，并返回新的组件，组件在该过程中不会受到影响
import { connect } from 'react-redux';

import '@assets/paper.scss';
import Topic from './topic';
import UpPaper from './upPaper';

class AddPaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.upSuccess = this.upSuccess.bind(this);
  }
  componentWillMount() {}

  upSuccess() {
    createHashHistory().push('/main/paper');
  }

  render() {
    return (
      <div className="addPaper">
        <Topic />
        <div>
          <UpPaper upSuccess={this.upSuccess} />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
});
export default connect(mapStateToProps)(AddPaper);
