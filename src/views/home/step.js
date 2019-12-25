import React from 'react';
import { connect } from 'react-redux';
import '@assets/step.scss';

import http from '../../utils/http';
import { urls } from '../../utils/api';

import { Steps, Button } from 'antd';

const { Step } = Steps;

import { createHashHistory } from 'history';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentObj: null,
      current: 0,
      steps: []
    };
    this.getData = this.getData.bind(this);
    this.goChoose = this.goChoose.bind(this);
    this.goStep = this.goStep.bind(this);
    this.dealText = this.dealText.bind(this);
    this.dealData = this.dealData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  /* 去选题 */
  goChoose() {
    if (this.state.currentObj.step == 1) {
      createHashHistory().push('/main/topic');
    } else if (this.state.currentObj.step == 2) {
      if (!this.state.currentObj.childStatus) {
        createHashHistory().push('/main/addPaper');
      } else if (this.state.currentObj.childStatus == 2) {
        createHashHistory().push('/main/paper');
      }
    } else if (this.state.currentObj.step == 3) {
      // 1、等待答辩 2、待回答 3、待评定 4、合格 5、不合格
      createHashHistory().push('/main/defence');
    }
  }

  dealText() {
    let text = '';
    if (this.state.currentObj.step == 1) {
      text = '去选题';
      if (this.state.currentObj.childStatus == 1) {
        text = '查看原因并修改';
      }
    } else if (this.state.currentObj.step == 2) {
      text = '上传论文';
      if (this.state.currentObj.childStatus == 2) {
        text = '查看原因并修改';
      }
    }

    return text;
  }
  goStep(index, status) {
    switch (index) {
      case 1:
        createHashHistory().push('/main/topic');
        break;
      case 2:
        status > 0
          ? createHashHistory().push('/main/paper')
          : createHashHistory().push('/main/addPaper');
        break;
      case 3:
        createHashHistory().push('/main/defence');
        break;

      default:
        break;
    }
  }

  getData() {
    http.get(urls.PAPER_STEP).then(res => {
      if (res) {
        this.setState({
          steps: res.body.steps
        });
        this.dealData(res.body.steps);
      }
    });
  }

  /* 获取到当前阶段和状态 */
  dealData(data) {
    let flag = false;
    data.forEach(item => {
      if (item.status == 2 || (item.step == 4 && item.status > 2)) {
        flag = true;
        this.setState({
          currentObj: item
        });
      }
    });
    if (flag == false) {
      data.forEach(item => {
        if (item.status > 2) {
          this.setState({
            currentObj: item
          });
        }
      });
    }
  }
  render() {
    let current = this.state.current;
    let steps = this.state.steps;
    let currentObj = this.state.currentObj;
    let btn;
    if (currentObj) {
      if (currentObj.step == 1) {
        if (currentObj.childStatus == null || !this.props.topic.outline) {
          btn = (
            <Button className="btn" type="primary" onClick={this.goChoose}>
              {this.props.topic.title && !this.props.topic.outline
                ? '编辑大纲'
                : '去选题'}
            </Button>
          );
        } else if (currentObj.childStatus == 1) {
          btn = (
            <Button className="btn" type="primary" onClick={this.goChoose}>
              查看原因并修改
            </Button>
          );
        }
      } else if (currentObj.step == 2) {
        if (currentObj.childStatus == null) {
          btn = (
            <Button className="btn" type="primary" onClick={this.goChoose}>
              上传论文
            </Button>
          );
        } else if (currentObj.childStatus == 2) {
          btn = (
            <Button className="btn" type="primary" onClick={this.goChoose}>
              查看原因并修改
            </Button>
          );
        }
      } else if (currentObj.step == 3) {
        if (currentObj.childStatus == 2) {
          btn = (
            <Button className="btn" type="primary" onClick={this.goChoose}>
              上传答辩稿
            </Button>
          );
        }
      }
    }

    return (
      <div className="step-block">
        <div className="step-title">论文阶段</div>
        <Steps labelPlacement="vertical" current={current}>
          {steps.map((item, index) => (
            <Step
              status={
                item.status < 2
                  ? 'wait'
                  : item.status == 2
                  ? 'process'
                  : 'finish'
              }
              key={index}
              title={item.name}
              // onClick={this.goStep.bind(this, item.step, item.status)}
              description={item.stepDescription}
            />
          ))}
        </Steps>

        <div className="status-block">
          {currentObj ? (
            <div className="status-list">
              <div className="tit">{currentObj.guide}</div>
              <div className="con">{currentObj.guideDescription}</div>
              {btn}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo,
  topic: state.topic
});

export default connect(mapStateToProps)(User);
