import React from 'react';
import { Router } from 'react-router';
import { Route, Switch, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history'; // 是hash路由 history路由 自己根据需求来定
const history = createHashHistory();
import './App.css';
import NotFound from './views/error/notFound';
import routes from './router';

// 监听路由;
history.listen((location, action) => {
  // 判断是否存在这个路由
  let hasRoute = routes.findIndex(item => {
    return item.path == location.pathname;
  });
  if (hasRoute > -1 && !sessionStorage.getItem('sToken')) {
    createHashHistory().push('/login');
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.updateTitle(this.props);
  }

  componentWillUpdate(nextProps) {
    // this.updateTitle(nextProps);
  }

  updateTitle = props => {
    routes.forEach(route => {
      if (route.path === history.location.pathname) {
        if (!sessionStorage.getItem('sToken')) {
          createHashHistory().push('/login');
        }
      }
    });
  };

  render() {
    return (
      <Router history={history}>
        <div className="app">
          <Switch>
            {routes.map((item, index) => {
              return (
                <Route
                  key={index}
                  path={item.path}
                  exact
                  render={props => <item.component {...props} />}
                />
              );
            })}
            {/* // 所有错误路由跳转页面 */}
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
