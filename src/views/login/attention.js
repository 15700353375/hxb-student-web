/*
 * author: Arya
 * description: 注意事项（弹窗）
 * time: 2019-12-12
 */
import React from 'react';
import { Modal, Button } from 'antd';
import '@assets/attention.scss';
import http from '@utils/http';
import { urls } from '@utils/api';
import { createHashHistory } from 'history';
export default class Attention extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      loading: false,
      times: 8,
      isClick: false
    };
  }
  componentDidMount() {
    let timer = setInterval(() => {
      let times = this.state.times;

      if (times <= 0) {
        clearInterval(timer);
        this.setState({
          isClick: true
        });
      } else {
        this.setState({
          times: times - 1
        });
      }
    }, 1000);
  }

  handleOk = e => {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.setState({
      loading: true
    });
    http.put(urls.NOTES_ACK, null).then(res => {
      if (res) {
        userInfo.notesAck = true;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        createHashHistory().push('/home');
      }
      this.setState({
        loading: false
      });
    });

    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <Modal
        title={[
          <div className="attention-header" key="submit">
            注意事项
          </div>
        ]}
        width={500}
        centered={true}
        closable={false}
        keyboard={false}
        maskClosable={false}
        visible={this.state.visible}
        onOk={this.handleOk}
        footer={[
          <div className="attention-footer" key="submit">
            <Button
              key="submit"
              type="primary"
              disabled={!this.state.isClick}
              loading={this.state.loading}
              onClick={this.handleOk}
            >
              我已仔细阅读上述事项({this.state.times})
            </Button>
          </div>
        ]}
      >
        <p className="attention-content">
          (一)参加论文写作和答辩的学生须严格按照规定时间及流程完成此项工作。否则将顺延至下一批次重新完成此项工作。
          <br />
          (二)论文写作的论文稿件,请学生自行备份底稿,以备遗失弥补。
          <br />
          (三)毕业后需申请学士学位的学生,请自留论文正稿一份,待今后申报学位时备用。
          <br />
          (四)抽中参加现场答辩的学生应按时报到,未办理报到手续者不能参加此次论文现场答辩。
          <br />
          (五)现场答辩报到时,必须持本人身份证、准考证,经验证无误后方能参加答辩。
          <br />
          (六)参加现场答辩的学生,交通食宿等费用自理,抽中现场答辩未参加现场答辩的同学,本次论文撰写成绩取消。
          <br />
          (七)现场答辩时间如无变动,不再另行通知。
          <br />
          (八)因本人原因未完成论文写作或未参加答辩者不予退费,下次报名另行缴费。
          <br />
          (九)毕业论文模板、毕业论文格式及规范、毕业论文示例、毕业论文管理办法详情见附件,请学生仔细阅读,学生必须按照格式及规范撰写论。
        </p>
        {/* <p>Some contents...</p>
        <p>Some contents...</p> */}
      </Modal>
    );
  }
}
