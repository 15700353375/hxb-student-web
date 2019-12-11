// import App from './App';
// import React, { Component } from 'react';
// import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Login from './views/login';
import Home from './views/home';

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/login', 
    name: 'login',
    component: Login,
  },
  {
    path: '/home', 
    name:'home',
    component: Home,
  }
]


export default routes