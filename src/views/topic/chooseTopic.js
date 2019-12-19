/*
 * author: Arya
 * description: 登录页面
 * time: 2019-12-12
 */
import React from 'react';
import { Form, Input, Button, Select, message, Modal, Radio } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;
import http from '@utils/http';
import { urls } from '@utils/api';

// connect方法的作用：将额外的props传递给组件，并返回新的组件，组件在该过程中不会受到影响
import { connect } from 'react-redux';

import '@assets/chooseTopic.scss';

class ChooseTopic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      topicList: [],
      topic: {},
      radio: 1
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.postData = this.postData.bind(this);
    this.editData = this.editData.bind(this);
    this.getTopic = this.getTopic.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    this.getData();
    if (this.props.edit == true) {
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
              titleId:
                this.state.topic.type == 2 ? this.state.topic.titleId : null,
              title: this.state.topic.type == 2 ? '' : this.state.topic.title,
              outline: this.state.topic.outline
            });
            this.setState({
              radio: this.state.topic.type == 2 ? 1 : 2
            });
          }
        );
      }
    });
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
        if (that.props.edit == true) {
          that.editData(values);
        }
        that.postData(values);
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
    console.log(values);
    http.postJson(urls.PAPER_TOPIC_SELECT, values).then(res => {
      if (res) {
        this.props.chooseSuccess();
      }
      this.setState({
        loading: false
      });
    });
  }

  onChange(e) {
    let value = e.target.value;
    this.setState({
      radio: value
    });

    if (value == 1) {
      this.props.form.setFieldsValue({
        title: ''
      });
    } else {
      this.props.form.setFieldsValue({
        titleId: null
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let userInfo = {
      majorName: ''
    };
    userInfo = this.props.userInfo || userInfo;
    let topicList = this.state.topicList;

    return (
      <div className="chooseTopic">
        <h2>欢迎登录论文管理系统</h2>
        <Form onSubmit={this.handleSubmit} className="login-form login-content">
          <Radio.Group
            onChange={this.onChange}
            value={this.state.radio}
            disabled={this.props.edit == true}
          >
            <div className="topic-title">
              <Radio value={1} name="radio"></Radio>
              选择题目
              <span className="title-little">
                当前专业：{userInfo.majorName}
              </span>
            </div>
            <Form.Item>
              {getFieldDecorator('titleId', {})(
                <Select
                  disabled={this.props.edit == true || this.state.radio == 2}
                  size="large"
                  placeholder="请选择题目"
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
              <Radio value={2} name="radio"></Radio>
              或自定义题目<span className="title-little">建议选择已有题目</span>
            </div>
            <Form.Item>
              {getFieldDecorator('title', {})(
                <Input
                  disabled={this.props.edit == true || this.state.radio == 1}
                  size="large"
                  placeholder="请输入题目"
                />
              )}
            </Form.Item>
          </Radio.Group>
          <div className="topic-title">大纲</div>

          <Form.Item>
            {getFieldDecorator('outline', {
              rules: [
                { required: true, message: '请输入大纲!' },
                { min: 300, max: 500, message: '最少300字，最多500字!' }
              ],
              validateTrigger: 'onChange'
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
export default Form.create({
  name: 'normal_login'
  // onValuesChange(props, values) {
  //   if (values.title) {
  //     props.form.setFieldsValue({
  //       titleId: null
  //     });
  //   }
  // 表单域改变时触发actions方法，控制isEdit为true
  // props.actions.changeCarEvaluate();
  // }
})(Comp);
