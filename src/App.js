// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Button } from 'antd';

import Login from './views/login';
function Index() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login/">Login</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Index} />
        <Route path="/login" component={Login} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
        <Button type="primary">Primary</Button>
      </div>
    </Router>
  );
}

export default App;
