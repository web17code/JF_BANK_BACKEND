import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Dictionary from '../components/Dictionary'
import Log from '../components/Log'
import User from '../components/User'
import Menu from '../components/Menu'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path:'/Dictionary',
      name:'数据字典',
      component:Dictionary
    },
    {
      path:'/User',
      name:'用户管理',
      component:User
    },
    {
      path:'/Log',
      name:'日志管理',
      component:Log
    },
    {
      path:'/Menu',
      name:'菜单路由',
      component:Menu
    }
  ]
})
