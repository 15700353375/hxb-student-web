import React from 'react';
import { Steps } from 'antd';
const { Step } = Steps;
import http from '@utils/http';
import { urls } from '@utils/api';
import '@assets/paper.scss';
import wordUrl from '@assets/img/word.png';
export default class UploadHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paperList: []
    };
    this.getData = this.getData.bind(this);
    this.dealData = this.dealData.bind(this);
    this.dealStatus = this.dealStatus.bind(this);
  }
  componentDidMount() {
    this.props.onRef(this);
    this.getData();
  }

  getData() {
    http.get(urls.PAPER_HISTORY).then(res => {
      if (res) {
        this.setState({
          paperList: this.dealData(res.body)
        });
      }
    });
  }

  dealData(data) {
    data.forEach(item => {
      item.submitAt = Moment(item.submitAt).format('YYYY-MM-DD HH:mm');
      item['stepStatus'] = this.dealStatus(item.status);
      item.downUrl = decodeURI(item.downUrl);
      let t = item.downUrl.split('?')[0].split('/');
      let n = t[t.length - 1].split('_');
      item['docName'] = n[1];
    });
    return data;
  }

  // 0待提交 1待审核  2驳回 3审核通过 4不通过
  dealStatus(status) {
    let name = 'wait';
    switch (status) {
      case 0:
        name = 'wait';
        break;
      case 1:
        name = 'wait';
        break;
      case 2:
        name = 'error';
        break;
      case 3:
        name = 'finish';
        break;
      case 4:
        name = 'error';
        break;

      default:
        break;
    }
    return name;
  }
  render() {
    let paperList = this.state.paperList;
    return (
      <div className="uploadHistory">
        <div className="tit">上传历史</div>
        <div>
          <Steps
            className="paper-history-step"
            progressDot
            direction="vertical"
          >
            {paperList.map((item, index) => (
              <Step
                key={index}
                subTitle={item.submitAt}
                title={
                  <div>
                    <span>{item.statusShow}</span>
                    <img src={wordUrl} />
                    <p>{item.docName}</p>
                    <a download={item.downUrl} href={item.downUrl}>
                      下载
                    </a>
                  </div>
                }
                status={item.stepStatus}
                description={
                  item.advice ? (
                    <span>
                      <b>修改意见：</b> {item.advice}
                    </span>
                  ) : null
                }
              />
            ))}
          </Steps>
        </div>
      </div>
    );
  }
}
