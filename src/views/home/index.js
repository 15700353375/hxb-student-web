/*
 * @Author:      Arya
 * @DateTime:    2020-05-21
 * @Description: 首页-主页面
 */
import React from 'react'
import { connect } from 'react-redux'
import TopBar from '../main/topBar'
import ChooseBatch from '@components/chooseBatch'
import '@assets/home.scss'
import paperUrl from '@assets/img/web2x_lunwen.png'
import provinceTestUrl from '@assets/img/web2x_shenkao.png'
import { createHashHistory } from 'history'
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowBatch: false
    }
    this.goProviceTest = this.goProviceTest.bind(this)
    this.goPaper = this.goPaper.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  goPaper() {
    createHashHistory().push('/main/home')
  }
  goProviceTest() {
    // createHashHistory().push('/province/examPlan')
    this.setState({
      isShowBatch: true
    })
  }

  closeModal() {
    this.setState({
      isShowBatch: false
    })
  }
  render() {
    return (
      <div className="home">
        <TopBar />
        <div className="home-main">
          <div className="home-block" onClick={this.goPaper}>
            <img src={paperUrl} />
            <span>论文</span>
          </div>
          <div className="home-block" onClick={this.goProviceTest}>
            <img src={provinceTestUrl} />
            <span>省考</span>
          </div>
        </div>
        {this.state.isShowBatch ? (
          <ChooseBatch closeModal={this.closeModal} />
        ) : null}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
})
export default connect(mapStateToProps)(Home)
