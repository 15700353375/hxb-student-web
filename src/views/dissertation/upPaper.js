/*
 * author: Arya
 * description: 上传论文
 * time: 2019-12-20
 */
import React from 'react';
import { Button } from 'antd';
import '@assets/paper.scss';
import UpFile from '@components/upFile';
import http from '@utils/http';
import { urls } from '@utils/api';
class UpPaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      templateUrl: []
    };
    this.upSuccess = this.upSuccess.bind(this);
  }
  componentDidMount() {}

  componentWillMount() {
    this.getData();
  }

  getData() {
    http.get(urls.PAPER_DOWNLOAD).then(res => {
      if (res) {
        this.setState({
          templateUrl: [res.body.files[2].value, res.body.files[3].value]
        });
      }
    });
  }

  downLoad(ind) {
    let alink = document.createElement('a');
    alink.download = '论文写作规范'; //文件名,大部分浏览器兼容,IE10及以下不兼容
    alink.href = this.state.templateUrl[ind];
    alink.click(); //自动点击
  }

  upSuccess() {
    this.props.upSuccess();
  }

  render() {
    return (
      <div className="upPaper">
        <div className="tit">
          论文上传
          <Button type="primary" ghost onClick={this.downLoad.bind(this, 0)}>
            下载论文写作规范
          </Button>
          <Button
            type="primary"
            className="margin-R20"
            ghost
            onClick={this.downLoad.bind(this, 1)}
          >
            下载论文样板
          </Button>
        </div>
        <div className="upPaper-tips">
          请在稿件中留下
          <span>姓名、准考证号、联系方式</span>
          ;如修改稿件,请将修改部分用
          <span>下划线或红色字体</span>
          清楚地标示出来
        </div>
        <div className="upFile">
          <UpFile upUrl="PAPER" upSuccess={this.upSuccess} />
        </div>
      </div>
    );
  }
}

export default UpPaper;
