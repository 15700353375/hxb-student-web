// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
// import { browserHistory } from 'react-router';
import { createHashHistory, createBrowserHistory } from 'history'; // 是hash路由 history路由 自己根据需求来定
const history = createHashHistory();
// import { Button } from 'antd';
import './App.css';
import Login from './views/login';
import Home from './views/home';
// function Index() {
//   return <h2>Home</h2>;
// }
function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    window.reactHistory = history;
  }

  render() {
    return (
      <Router history={history}>
        <div className="app">
          <nav>
            <ul>
              <li>
                <Link to="/">login</Link>
              </li>
              <li>
                <Link to="/home/">Home</Link>
              </li>
              <li>
                <Link to="/about/">About</Link>
              </li>
              <li>
                <Link to="/users/">Users</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/home" component={Home} />
            <Route path="/about/" component={About} />
            <Route path="/users/" component={Users} />
          </Switch>

          {/* <Button type="primary">Primary</Button> */}
        </div>
      </Router>
    );
  }
}

export default App;
