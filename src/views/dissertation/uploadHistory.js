import React from 'react';
import { Steps, Divider } from 'antd';
const { Step } = Steps;
import '@assets/paper.scss';
export default class UploadHistory extends React.Component {
  render() {
    return 
    <div className='uploadHistory'>
        <div className='tit'>上传历史</div>
        <div>
            <Steps progressDot  direction="vertical">
                <Step title="Finished" status='finish' description="This is a description. This is a description." />
                <Step title="Finished" status='error'  description="This is a description. This is a description." />
                <Step title="In Progress" status='error' description="This is a description. This is a description." />
                <Step title="Waiting" status='finish ' description="This is a description." />
                <Step title="Waiting" status='error' description="This is a description." />
            </Steps>
        </div>
    </div>;
  }
}
