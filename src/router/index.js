import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Dictionary from '../components/Dictionary.vue'
import Log from '../components/Log.vue'
import User from '../components/User.vue'
import Menu from '../components/Menu.vue'
import MenuIcon from '../components/MenuIcon.vue'
import Role from '../components/Role.vue'
import App from '../components/App.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      component:Login
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
    },
    {
      path:'/MenuIcon',
      name:'菜单图标',
      component:MenuIcon
    },
    {
      path:'/Role',
      name:'角色管理',
      component:Role
    },
    {
      path:'/App',
      name:'应用管理',
      component:App
    }
  ]
})
