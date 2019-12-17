import React from 'react';
import { connect } from 'react-redux';
import User from './user';
import Step from './step';

class Home extends React.Component {
  render() {
    return (
      <div>
        <User />
        <Step />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  userInfo: state.userInfo
});

export default connect(mapStateToProps)(Home);
