// import App from './App';
// import React, { Component } from 'react';
// import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import Login from './views/login'
import Main from './views/main'
import PaperHome from './views/paperHome'
import AddPaper from './views/dissertation/addPaper'
import Paper from './views/dissertation/paper'
import Defence from './views/defence'
import Topic from './views/topic'
import Home from './views/home'
// import NotFound from './views/error/notFound';
import Province from './views/provinceTest'
import ExamPlan from './views/provinceTest/examPlan'
import Exam from './views/provinceTest/exam'
import ExamDetail from './views/provinceTest/examDetail'

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
  {
    path: '/home',
    name: 'home',
    component: Home
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
        name: 'paperHome',
        component: PaperHome
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
  },
  {
    path: '/province',
    name: 'province',
    component: Province,
    description: '学生端省考',
    routes: [
      {
        path: '/province/examPlan',
        name: 'examPlan',
        component: ExamPlan
      },
      {
        path: '/province/exam',
        name: 'exam',
        component: Exam
      },
      {
        path: '/province/examDetail',
        name: 'examDetail',
        component: ExamDetail
      }
    ]
  }
]

export default routes
