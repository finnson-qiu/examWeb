import Vue from 'vue'
import Router from 'vue-router'
import home from '../pages/home'
import login from '../pages/login'
import register from '../pages/register'
import forget from '../pages/forget'
import admin from '../pages/admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/forget',
      name: 'forgetPassword',
      component: forget
    },
    {
      path: '/home',
      name:'homePage',
      component: home
    },
    {
      path: '/admin',
      name: 'adminPage',
      component: admin
    }
  ]
})
