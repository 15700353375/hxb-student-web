import React from 'react';
import { connect } from 'react-redux';
import '@assets/step.scss';

import http from '../../utils/http';
import { urls } from '../../utils/api';

import { Steps, Divider, Icon, Button } from 'antd';

const { Step } = Steps;

import { createHashHistory } from 'history';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      steps: []
    };
    this.getData = this.getData.bind(this);
    this.goChooseExer = this.goChooseExer.bind(this);
    // this.goStep = this.goStep.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  /* 去选题 */
  goChooseExer() {
    createHashHistory().push('/main/topic');
  }
  goStep(index) {
    switch (index) {
      case 0:
        createHashHistory().push('/main/topic');
        break;
      case 1:
        createHashHistory().push('/main/addPaper');
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
      }
    });
  }
  render() {
    let current = this.state.current;
    let steps = this.state.steps;
    return (
      <div className="step-block">
        <div className="step-title">论文阶段</div>
        <Steps labelPlacement="vertical" current={current}>
          {steps.map((item, index) => (
            <Step
              status={item.status > 1 ? 'finish' : 'wait'}
              key={index}
              title={item.name}
              onClick={this.goStep.bind(this, index)}
              description={item.stepDescription}
            />
          ))}
        </Steps>

        <div className="status-block">
          <div className="status-list">
            <div className="tit">你还没有选题哦</div>
            <div className="con">离选题结束还有X天X小时，快去选题吧~</div>
            {steps.length && steps[0].status <= 1 ? (
              <Button
                className="btn"
                type="primary"
                onClick={this.goChooseExer}
              >
                去选题
              </Button>
            ) : null}
          </div>
          <div className="status-list">
            <div className="tit">你的选题大纲待老师审核</div>
            <div className="con">请耐心等待</div>
          </div>
          <div className="status-list">
            <div className="tit">你还没有选题哦</div>
            <div className="con">离选题结束还有X天X小时，快去选题吧~</div>
            <Button className="btn" type="primary">
              去选题
            </Button>
          </div>
          <div className="status-list">
            <div className="tit">你还没有选题哦</div>
            <div className="con">离选题结束还有X天X小时，快去选题吧~</div>
            <Button className="btn" type="primary">
              去选题
            </Button>
          </div>
          <div className="status-list">
            <div className="tit">你还没有选题哦</div>
            <div className="con">离选题结束还有X天X小时，快去选题吧~</div>
            <Button className="btn" type="primary">
              去选题
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
});

export default connect(mapStateToProps)(User);
