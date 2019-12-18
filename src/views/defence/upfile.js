/*
 * author: Arya
 * description: 上传文件
 * time: 2019-12-17
 */
import React from 'react';
import { Upload, Button, message, Spin } from 'antd';
const { Dragger } = Upload;
import { createHashHistory } from 'history';
import http from '@utils/http';
import { urls } from '@utils/api';

import upfileUrl from '@assets/img/upfile.png';
import common from '@utils/common';
class UpFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: '',
      templateUrl: '',
      loading: false
    };
    this.postData = this.postData.bind(this);
    this.downLoad = this.downLoad.bind(this);
  }
  componentDidMount() {}
  postData() {
    this.setState({
      btnLoading: true
    });
    let params = {
      path: this.state.fileUrl
    };
    http.postJson(urls.ONLINE_ANSWER, params).then(res => {
      if (res) {
        message.success('上传成功');
      }
      this.setState({
        btnLoading: false
      });
      this.props.upSuccess();
    });
  }

  downLoad() {
    let alink = document.createElement('a');
    alink.download = '答辩模板'; //文件名,大部分浏览器兼容,IE10及以下不兼容
    alink.href = this.props.answerTemplateUrl;
    alink.click(); //自动点击
  }

  render() {
    const props = {
      name: 'file',
      accept: '.doc,.docx',
      multiple: false,
      // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        // debugger;
        // common.handleUpload(info.fileList[0]);
        // const { status } = info.file;
        // if (status !== 'uploading') {
        //   // debugger;
        //   console.log(info.file, info.fileList);
        // }
        // if (status === 'done') {
        //   debugger;
        //   message.success(`${info.file.name} file uploaded successfully.`);
        // } else if (status === 'error') {
        //   debugger;
        //   message.error(`${info.file.name} file upload failed.`);
        // }
      },
      beforeUpload: file => {
        // this.loading = true;
        this.setState({
          loading: true
        });
        common.handleUpload(file).then(
          val => {
            console.log(val);
            this.setState({
              loading: false,
              fileUrl: val
            });
            return true;
          },
          () => {
            this.setState({
              loading: false
            });
            return false;
          }
        );
      }
    };
    return (
      <div className="basicInfo margin-T20">
        <div className="basicInfo-block">
          <div className="tit tit2">
            答辩稿上传
            <Button type="primary" ghost onClick={this.downLoad}>
              下载答辩模板
            </Button>
          </div>
        </div>
        <Spin tip="Loading..." spinning={this.state.loading}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <img src={upfileUrl} />
            </p>
            <p className="ant-upload-text">点击或拖拽导入文件到此处上传</p>
            <p className="ant-upload-hint">支持扩展名：doc、docx</p>
          </Dragger>
        </Spin>
        <div className="text-right margin-T20">
          <Button
            type="primary"
            loading={this.state.btnLoading}
            onClick={this.postData}
          >
            提交
          </Button>
        </div>
      </div>
    );
  }
}

export default UpFile;
