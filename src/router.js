// import App from './App';
// import React, { Component } from 'react';
// import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Login from './views/login';
import Main from './views/main';
import Home from './views/home';
import AddPaper from './views/dissertation/addPaper';
import Paper from './views/dissertation/paper';
import Defence from './views/defence';
import Topic from './views/topic';
// import NotFound from './views/error/notFound';

const routes = [
  // {
  //   path: '/',
  //   component: Home
  // },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  // {
  //   path: '/notFound',
  //   name: 'notFound',
  //   component: NotFound
  // },
  {
    path: '/main',
    name: 'main',
    component: Main,
    description: '论文管理系统首页',
    routes: [
      {
        path: '/main/home',
        name: 'home',
        component: Home
      },
      {
        path: '/main/topic',
        name: 'topic',
        component: Topic
      },
      {
        path: '/main/addPaper',
        name: 'addPaper',
        component: AddPaper
      },
      {
        path: '/main/paper',
        name: 'paper',
        component: Paper
      },
      {
        path: '/main/defence',
        name: 'Defence',
        component: Defence
      }
    ]
  }
];

export default routes;
