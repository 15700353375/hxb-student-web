import React, { Component } from 'react';
import '@assets/sideBar.scss';
import http from '../../utils/http';
import { urls } from '../../utils/api';
import { connect } from 'react-redux';
import { Button } from 'antd';
import store from '@store';

import { createHashHistory } from 'history'; // 是hash路由 history路由 自己根据需求来定
class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoute: null,
      attention: [
        {
          title: '注意事项',

          content: `(一)参加论文写作和答辩的学生须严格按照规定时间及流程完成此项工作。否则将顺延至下一批次重新完成此项工作。
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
            (九)毕业论文模板、毕业论文格式及规范、毕业论文示例、毕业论文管理办法详情见附件,请学生仔细阅读,学生必须按照格式及规范撰写论。`
        },
        {
          title: '选题须知',
          content:
            '1、除参考选题外，学生也可结合自身实际拟定论文题目，但必须与所修专业相关；<br /> 2、选题和大纲须同时提交；<br /> 3、提交后，请耐心等待分配老师。分配老师后，将由老师对选题及大纲进行审定；<br />4、收到老师的修改意见时，请及时修改；<br />5、请在选题截止日期前完成选题和大纲撰写；<br />          6、如需论文帮助，请联系指导老师。'
        },
        {
          title: '论文写作与须知',

          content: `1、请在初稿截止日期前完成初稿上传；<br />2、论文初稿应包括论文摘要、正文、参考文献三项内容；<br />3、提交论文时，学生须在初稿中留下自己的姓名、准考证号、联系方式等资料，同时注意论文的格式须符合要求，以便指导教师下载审阅；<br />4、在修改论文时，必须将修改部分用下划线或红色字体清楚地标示出来，以便指导教师进行再次审阅；<br />
          5、应根据指导教师提出的修改意见认真修改并上传论文至写作平台，直至论文达到定稿要求。若指导教师在论文定稿截止日期时仍不同意定稿则默认为论文成绩不合格；<br />
          6、请在论文截止时间前完成论文定稿。`
        },
        {
          title: '网上答辩须知',

          content: `1、将由论文指导教师根据论文内容提出答辩问题3-5个；<br />
          2、学生应在规定时间内上传书面答辩稿；<br />
          3、如需论文帮助，请联系指导老师。`
        }
      ],
      list: [
        {
          name: '论文选题表'
        },
        {
          name: '论文任务书'
        },
        {
          name: '论文网上答辩模板'
        }
      ]
    };
    this.getData = this.getData.bind(this);

    store.subscribe(() => {
      let state = store.getState();
      this.setState({
        currentRoute: state.currentRoute
      });
    });
  }
  componentDidMount() {
    this.getData();
    this.setState({
      currentRoute: this.props.currentRoute
    });
  }

  getData() {
    http.get(urls.PAPER_DOWNLOAD).then(res => {
      if (res) {
        this.setState({
          list: res.body.files
        });
      }
    });
  }

  render() {
    const list = this.state.list;
    const listItems = list.map((item, index) => (
      <a key={index} href={item.value} download={item.value}>
        <Button>{item.key}</Button>
      </a>
    ));
    let attention = this.state.attention;
    let current = attention[0];
    let currentRoute = this.state.currentRoute;
    if (currentRoute && currentRoute.pathname == '/main/topic') {
      current = attention[1];
    } else if (
      currentRoute &&
      currentRoute.pathname.toLowerCase().indexOf('paper') > -1
    ) {
      current = attention[2];
    } else if (
      currentRoute &&
      currentRoute.pathname.toLowerCase().indexOf('defence') > -1
    ) {
      current = attention[3];
    }

    function createMarkup() {
      return { __html: current.content };
    }
    return (
      <div className="sidebar">
        <div className="sidebar-block">
          <div className="sidebar-block-title">
            <span>{current.title}</span>
            {/* <a>展开</a> */}
          </div>
          <div
            className="sidebar-content"
            dangerouslySetInnerHTML={createMarkup()}
          ></div>
        </div>
        <div className="sidebar-block">
          <div className="sidebar-block-title">
            <span>下载专区</span>
          </div>
          <div className="sidebar-content clearfix">
            <div className="downList clearfix">{listItems}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  currentRoute: state.currentRoute
});

export default connect(mapStateToProps)(SideBar);
