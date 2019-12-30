/*
 * author: Arya
 * description: 上传答辩文件-组件
 * time: 2019-12-17
 */
import React from 'react';
import { Button, message } from 'antd';

import UpFile from '@components/upFile';

class Upfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}

  downLoad(ind) {
    let alink = document.createElement('a');
    alink.download = '答辩模板'; //文件名,大部分浏览器兼容,IE10及以下不兼容
    alink.href = this.props.templateUrl[ind];
    alink.click(); //自动点击
  }

  render() {
    return (
      <div className="basicInfo margin-T20">
        <div className="basicInfo-block">
          <div className="tit tit2">
            答辩稿上传
            <Button type="primary" ghost onClick={this.downLoad.bind(this, 0)}>
              下载答辩模板
            </Button>
            <Button
              type="primary"
              className="margin-L20"
              ghost
              onClick={this.downLoad.bind(this, 1)}
            >
              下载答辩技巧
            </Button>
          </div>
        </div>
        <UpFile upUrl="ONLINE_ANSWER" upSuccess={this.props.upSuccess} />
      </div>
    );
  }
}

export default Upfile;
