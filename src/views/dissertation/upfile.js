/*
 * author: Arya
 * description: 上传文件
 * time: 2019-12-17
 */
import React from 'react';
import { Upload, Button, message } from 'antd';
const { Dragger } = Upload;

import upfileUrl from '@assets/img/upfile.png';
import common from '@utils/common';
class UpFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // componentDidMount() {
  //   debugger;
  // }

  render() {
    const props = {
      name: 'file',
      multiple: false,
      // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      onChange(info) {
        // debugger;
        // common.handleUpload(info.fileList[0]);
        const { status } = info.file;
        if (status !== 'uploading') {
          // debugger;
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          debugger;
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      beforeUpload: file => {
        common.handleUpload(file);
        // return false;
      }
    };
    return (
      <div>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            {/* <Icon type="inbox" /> */}
            <img src={upfileUrl} />
          </p>
          <p className="ant-upload-text">点击或拖拽导入文件到此处上传</p>
          <p className="ant-upload-hint">支持扩展名：doc、docx</p>
        </Dragger>
        <div className="text-right margin-T20">
          <Button type="primary">提交</Button>
        </div>
      </div>
    );
  }
}

export default UpFile;
