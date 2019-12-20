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

let upData = {};
class UpFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: '',
      loading: false,
      fileList: []
      // upData: {}
    };
    this.postData = this.postData.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.getExtraData = this.getExtraData.bind(this);
    this.getSign = this.getSign.bind(this);
  }
  componentDidMount() {
    this.getSign();
  }

  // 获取签名
  getSign() {
    http.get(urls.GETOSSSIGNATURE).then(res => {
      if (res) {
        upData = res.body;
      }
    });
  }

  postData() {
    if (!this.state.fileUrl) {
      message.error('请上传文件！');
      return;
    }
    this.setState({
      btnLoading: true
    });

    let params = {
      path: this.state.fileUrl
    };
    http.postJson(urls.PAPER, params).then(res => {
      if (res) {
        message.success('上传成功');
      }
      this.setState({
        btnLoading: false
      });
      if (this.props.upSuccess) {
        this.props.upSuccess();
      } else {
        createHashHistory().push('/main/paper');
      }
    });
  }

  beforeUpload(file) {
    this.setState({
      fileUrl: ''
    });
    let isType = true;
    var name = file.name;
    var type = name.substring(name.indexOf('.'));
    if (['.doc', '.docx'].indexOf(type) < 0) {
      isType = false;
      message.error('请上传doc/docx文件!');
    }
    // 100mb
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.error('文件大小不能超过100MB!');
    }
    return isType && isLt100M;
  }

  getExtraData(file) {
    let fileUrl = `paper/${new Date().getTime()}_` + file.name;
    this.setState({
      fileUrl: fileUrl
    });
    return {
      key: fileUrl,
      OSSAccessKeyId: upData.OSSAccessKeyId,
      policy: upData.policy,
      Signature: upData.Signature
    };
  }

  render() {
    const props = {
      name: 'file',
      accept: '.doc,.docx',
      multiple: false,
      showUploadList: { showDownloadIcon: false },
      action: 'http://hxb-protect.oss-cn-chengdu.aliyuncs.com/',
      data: this.getExtraData,
      fileList: this.state.fileList,
      onChange: info => {
        const { status } = info.file;
        if (status !== 'uploading') {
          this.setState({
            fileList: []
          });
        }

        if (status === 'uploading') {
          let fileList = [...info.fileList];
          fileList = fileList.slice(-1);
          this.setState({
            fileList
          });
        }
        if (status === 'done') {
          let fileList = [...info.fileList];
          fileList = fileList.slice(-1);
          this.setState({
            fileList
          });
          this.getSign();
          message.success(`${info.file.name} 文件上传成功.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
          this.getSign();
        }
      },
      beforeUpload: this.beforeUpload
    };
    return (
      <div>
        {/* <Spin tip="Loading..." spinning={this.state.loading}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <img src={upfileUrl} />
            </p>
            <p className="ant-upload-text">点击或拖拽导入文件到此处上传</p>
            <p className="ant-upload-hint">支持扩展名：doc、docx</p>
          </Dragger>
        </Spin> */}
        <Dragger {...props} fileList={this.state.fileList}>
          <p className="ant-upload-drag-icon">
            <img src={upfileUrl} />
          </p>
          <p className="ant-upload-text">点击或拖拽导入文件到此处上传</p>
          <p className="ant-upload-hint">支持扩展名：doc、docx</p>
        </Dragger>
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
