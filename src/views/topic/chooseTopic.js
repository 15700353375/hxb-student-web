/*
 * author: Arya
 * description: 登录页面
 * time: 2019-12-12
 */
import React from 'react';
import { Form, Input, Button, Select, message, Modal } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
import { createHashHistory } from 'history';
import http from '@utils/http';
import { urls } from '@utils/api';
import verification from '@utils/verification';

// connect方法的作用：将额外的props传递给组件，并返回新的组件，组件在该过程中不会受到影响
import { connect } from 'react-redux';
import { setUserInfo } from '@store/actions';

import '@assets/chooseTopic.scss';

class ChooseTopic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      topicList: [],
      topic: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.postData = this.postData.bind(this);
    this.editData = this.editData.bind(this);
    this.getTopic = this.getTopic.bind(this);
  }
  componentDidMount() {
    console.log(this.props);
    this.getData();
    if (this.props.edit) {
      this.getTopic();
    }
  }

  getTopic() {
    http.get(urls.PAPER_TOPIC).then(res => {
      if (res) {
        this.setState(
          {
            topic: res.body
          },
          function() {
            this.props.form.setFieldsValue({
              titleId: this.state.topic.titleId,
              title: this.state.topic.titleId ? '' : this.state.topic.title,
              outline: this.state.topic.outline
            });
          }
        );
      }
    });
  }

  handleChange(value) {
    console.log(`selected ${value}`);
    // PAPER_TOPICS
  }

  getData() {
    http.get(urls.PAPER_TOPICS).then(res => {
      if (res) {
        this.setState({
          topicList: res.body
        });
      }
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!values.titleId && !values.title) {
          message.error('请选择题目或自定义题目');
          return;
        }
        this.showConfirm(values);
      }
    });
  };
  showConfirm(values) {
    let that = this;
    confirm({
      title: '确认要提交吗？',
      content: '提交后，只能等待老师审核后才能修改，请确保无误后再提交.',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        if (that.props.edit) {
          that.editData(values);
        }
        that.postData(values);
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  }

  editData(values) {
    this.setState({
      loading: true
    });
    let params = { outline: values.outline };
    http.put(urls.PAPER_TOPIC_OUTLINE, params).then(res => {
      if (res) {
        this.props.chooseSuccess();
      }
      this.setState({
        loading: false
      });
    });
  }

  postData(values) {
    this.setState({
      loading: true
    });
    http.postJson(urls.PAPER_TOPIC_SELECT, values).then(res => {
      if (res) {
        this.props.chooseSuccess();
      }
      this.setState({
        loading: false
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const validator_idCard = verification.validator_idCard;
    const validator_login_password = verification.validator_login_password;
    let userInfo = {
      majorName: ''
    };
    userInfo = this.props.userInfo || userInfo;
    let topicList = this.state.topicList;

    // const { titleId, title, outline } = this.state.topic;
    return (
      <div className="chooseTopic">
        <h2>欢迎登录论文管理系统</h2>
        <Form onSubmit={this.handleSubmit} className="login-form login-content">
          <div className="topic-title">
            选择题目<span>当前专业：{userInfo.majorName}</span>
          </div>
          <Form.Item>
            {getFieldDecorator('titleId', {})(
              <Select
                disabled={this.props.edit}
                size="large"
                placeholder="请选择题目"
                onChange={this.handleChange}
              >
                {topicList.map(item => (
                  <Option value={item.key} key={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <div className="topic-title">
            或自定义题目<span>建议选择已有题目</span>
          </div>
          <Form.Item>
            {getFieldDecorator('title', {})(
              <Input
                disabled={this.props.edit}
                size="large"
                placeholder="请输入题目"
              />
            )}
          </Form.Item>
          <div className="topic-title">大纲</div>
          <Form.Item>
            {getFieldDecorator('outline', {
              rules: [{ required: true, message: '请输入大纲!' }],
              validateTrigger: 'onBlur'
            })(
              <TextArea
                size="large"
                rows={6}
                placeholder="最少300字，最多500字"
              />
            )}
          </Form.Item>

          <Form.Item className="btn">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={this.state.loading}
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
});
const Comp = connect(mapStateToProps)(ChooseTopic);
export default Form.create({ name: 'normal_login' })(Comp);
