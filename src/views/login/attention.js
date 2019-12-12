/*
 * author: Arya
 * description: 注意事项（弹窗）
 * time: 2019-12-12
 */
import React from 'react';
import { Modal, Button } from 'antd';

export default class Attention extends React.Component {
  state = { visible: true };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  render() {
    return (
      <Modal
        title="Basic Modal"
        width={500}
        centered={true}
        closable={false}
        keyboard={false}
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    );
  }
}
