import React, { Component } from 'react';
import '../../assets/login.scss';
import http from '../../utils/http';
import { urls } from '../../utils/api';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { setTopic } from '@store/actions';
import TopBar from './topBar';
import SideBar from './sidebar';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '我是home'
    };
    this.getData = this.getData.bind(this);
  }
  componentDidMount() {
    this.getData();
  }

  getData() {
    http.get(urls.PAPER_TOPIC).then(res => {
      if (res) {
        this.setState({
          topic: res.body
        });
        localStorage.setItem('topic', JSON.stringify(res.body));
        this.props.dispatch(setTopic(res.body));
      }
    });
  }
  render() {
    return (
      <div className="home">
        <TopBar />
        <div className="main clearfix">
          <div className="content">
            <Switch>
              {this.props.routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
              ))}
            </Switch>
          </div>
          <SideBar />
        </div>
      </div>
    );
  }
}

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => {
        return <route.component {...props} key={props} routes={route.routes} />;
      }}
    />
  );
}

const mapStateToProps = state => ({
  userInfo: state.userInfo
});

export default connect(mapStateToProps)(Main);
