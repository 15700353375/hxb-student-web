import React, { Component } from 'react';
import '@assets/sideBar.scss';
import http from '../../utils/http';
import { urls } from '../../utils/api';
import { connect } from 'react-redux';
import homeUrl from '@assets/img/home.png';
import store from '@store';

import { createHashHistory } from 'history'; // 是hash路由 history路由 自己根据需求来定
const history = createHashHistory();
class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoute: null,
      attention: [
        {
          title: '注意事项',
          content:
            '(一)参加论文写作和答辩的学生须严格按照规定时间及流程完成此项工作。否则将顺延至下一批次重新完成此项工作。 <br />(二)论文写作的论文稿件,请学生自行备份底稿,以备遗失弥补。'
        },
        {
          title: '选题须知',
          content:
            '(一)参加论文写作和答辩的学生须严格按照规定时间及流程完成此项工作。否则将顺延至下一批次重新完成此项工作。<br/> (二)论文写作的论文稿件,请学生自行备份底稿,以备遗失弥补。<br/>(三)毕业后需申请学士学位的学生,请自留论文正稿一份,待今后申报学位时备用。<br/>(四)抽中参加现场答辩的学生应按时报到,未办理报到手续者不能参加此次论文现场答辩。<br/>(五)现场答辩报到时,必须持本人身份证、准考证,经验证无误后方能参加答辩。<br/>(六)参加现场答辩的学生,交通食宿等费用自理,抽中现场答辩未参加现场答辩的同学,本次论文撰写成绩取消。'
        },
        {
          title: '论文写作与须知',
          content:
            '请各学生尽快上传论文初稿。论文初稿应包括论文摘要、正文、参考文献三项内容。提交论文时,学生须在初稿中留下自己的姓名、准考证号、联系方式等资料,同时注意论文的格式须符合要求,以使指导教师下载审阅。学生在修改论文时,必须将修改部分用下划线或红色字体清楚地标示出来,以便指导教师进行再次审阅。'
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
    this.goHome = this.goHome.bind(this);

    store.subscribe(() => {
      console.log('state状态改变了，新状态如下');
      console.log(store.getState());
      let state = store.getState();
      this.setState({
        currentRoute: state.currentRoute
      });
    });
  }
  componentDidMount() {
    this.setState({
      currentRoute: this.props.currentRoute
    });
  }

  goHome() {
    createHashHistory().push('/home');
  }

  render() {
    const list = this.state.list;
    const listItems = list.map((item, index) => (
      <li key={index}>{item.name}</li>
    ));
    let attention = this.state.attention;
    let current = attention[0];
    let currentRoute = this.state.currentRoute;
    if (currentRoute && currentRoute.pathname == '/main/topic') {
      current = attention[1];
    } else if (currentRoute && currentRoute.pathname == '/main/addPaper') {
      current = attention[2];
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
            <ul>{listItems}</ul>
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
