/*
 * @Author:      Arya
 * @DateTime:    2020-05-21
 * @Description: 首页-主页面
 */
import React from 'react'
import { connect } from 'react-redux'
import TopBar from '../main/topBar'
import ChooseBatch from '@components/chooseBatch'
import PaperChooseBatch from '@components/paperChooseBatch'
import '@assets/home.scss'
import paperUrl from '@assets/img/web2x_lunwen.png'
import provinceTestUrl from '@assets/img/web2x_shenkao.png'
import Attention from '@components/attention'
import ProvinceAttention from '@components/provinceAttention'

// import { createHashHistory } from 'history'
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowBatch: false,
      isShowPaperBatch: false,
      showNotes: false,
      showProvinceAttention: false
    }
    this.goProviceTest = this.goProviceTest.bind(this)
    this.goPaper = this.goPaper.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.paperCloseModal = this.paperCloseModal.bind(this)
  }
  goPaper() {
    this.setState({
      isShowPaperBatch: true
    })
  }
  goProviceTest() {
    this.setState({
      isShowBatch: true
    })
  }

  closeModal(data) {
    this.setState({
      isShowBatch: false,
      showProvinceAttention: data || false
    })
  }

  paperCloseModal(data) {
    this.setState({
      isShowPaperBatch: false,
      showNotes: data || false
    })
  }
  render() {
    const { userInfo } = this.props
    const { showNotes, showProvinceAttention } = this.state
    return (
      <div className="home">
        {showNotes ? <Attention /> : null}
        {showProvinceAttention ? <ProvinceAttention /> : null}

        <TopBar />

        <div className="home-main">
          {userInfo && userInfo.hasPaper ? (
            <div className="home-block" onClick={this.goPaper}>
              <img src={paperUrl} />
              <span>论文</span>
            </div>
          ) : null}

          {userInfo && userInfo.hasExam ? (
            <div className="home-block" onClick={this.goProviceTest}>
              <img src={provinceTestUrl} />
              <span>省考</span>
            </div>
          ) : null}
        </div>
        {this.state.isShowBatch ? (
          <ChooseBatch closeModal={this.closeModal} />
        ) : null}
        {this.state.isShowPaperBatch ? (
          <PaperChooseBatch paperCloseModal={this.paperCloseModal} />
        ) : null}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
})
export default connect(mapStateToProps)(Home)
