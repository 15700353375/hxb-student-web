/*
 * author: Arya
 * description: 公共组件-上传doc/docx文件
 * time: 2019-12-23
 * 入参：upUrl='提交地址'
 * 出参：this.props.upSuccess() = 提交成功
 */

import React from 'react'
import { Upload, Button, Icon, message } from 'antd'
const { Dragger } = Upload

import http from '@utils/http'
import { urls } from '@utils/api'

import upfileUrl from '@assets/img/upfile.png'

class UpFile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      fileUrl: '',
      OSSData: null,
      btnLoading: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.beforeUpload = this.beforeUpload.bind(this)
    this.getExtraData = this.getExtraData.bind(this)
    this.postData = this.postData.bind(this)
  }

  componentDidMount() {
    console.log(1111111111111, this.props)
  }

  /* 提交数据到服务器 */
  postData() {
    if (!this.state.fileUrl) {
      message.error('请上传文件！')
      return
    }
    this.setState({
      btnLoading: true
    })

    let params = {
      path: this.state.fileUrl
    }

    http.postJson(urls[this.props.upUrl], params).then(res => {
      if (res) {
        message.success('上传成功')
        this.props.upSuccess()
      }
      this.setState({
        btnLoading: false
      })
    })
  }

  /* 上传状态 */
  handleChange = info => {
    let fileList = [...info.fileList]

    // 仅展示一个上传成功的文件
    fileList = fileList.slice(-1)

    if (info.file.status === 'uploading') {
      this.setState({ fileList })
      return
    }
    if (info.file.status === 'done') {
      let fileUrl = this.state.OSSData.fileUrl
      this.setState({ fileList, OSSData: null, fileUrl })
      message.success(`${info.file.name} 文件上传成功.`)
    }
    if (info.file.status === 'error') {
      this.setState({ fileList, OSSData: null, fileUrl: '' })
      message.error(`${info.file.name} 文件上传失败.`)
    }
  }

  /* 上传之前处理文件、获取签名 */
  beforeUpload(file) {
    return new Promise((resolve, reject) => {
      // 上传类型拦截
      var name = file.name
      var type = name.substring(name.indexOf('.'))
      if (['.doc', '.docx'].indexOf(type) < 0) {
        message.error('请上传doc/docx文件!')
        reject(false)
        return
      }
      // 上传大小拦截 100mb
      const isLt100M = file.size / 1024 / 1024 < 100
      if (!isLt100M) {
        message.error('文件大小不能超过100MB!')
        reject(false)
        return
      }

      // 获取签名
      http.get(urls.GETOSSSIGNATURE).then(res => {
        if (res) {
          this.setState(
            {
              OSSData: res.body
            },
            function() {
              resolve(file)
            }
          )
        } else {
          reject(false)
        }
      })
    })
  }

  /* 构造上传数据 */
  getExtraData = file => {
    const { OSSData } = this.state
    if (!OSSData) return
    let fileUrl = `paper/${new Date().getTime()}_` + file.name
    OSSData['fileUrl'] = fileUrl
    this.setState({
      OSSData,
      fileUrl: ''
    })
    return {
      key: fileUrl,
      OSSAccessKeyId: OSSData.OSSAccessKeyId,
      policy: OSSData.policy,
      Signature: OSSData.Signature
    }
  }

  render() {
    const props = {
      name: 'file',
      accept: '.doc,.docx',
      multiple: false,
      showUploadList: { showDownloadIcon: false },
      action: 'http://hxb-protect.oss-cn-chengdu.aliyuncs.com/',
      data: this.getExtraData,
      onChange: this.handleChange,
      beforeUpload: this.beforeUpload
    }
    return (
      <div>
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
    )
  }
}

export default UpFile
