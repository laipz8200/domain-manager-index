// import Vue from 'vue'
// import Router from 'vue-router'
import DomainTable from '@/components/DomainTable'
import DomainChecker from '@/components/DomainChecker'
import Login from '@/components/Login'
import UserCenter from '@/components/UserCenter'
import LoginWeChat from '@/components/LoginWeChat'
import Logout from '@/components/Logout'
import Admin from '@/components/Admin'

// Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: '/checker',     name: 'DomainChecker', component: DomainChecker }, { path: '/', redirect: '/user' },
    { path: '/table',       name: 'DomainTable',   component: DomainTable },
    { path: '/login',       name: 'Login',         component: Login },
    { path: '/logout',      name: 'Logout',        component: Logout },
    { path: '/user',        name: 'UserCenter',    component: UserCenter },
    { path: '/user/wechat', name: 'LoginWeChat',   component: LoginWeChat },
    { path: '/admin',       name: 'Admin',         component: Admin },
  ]
})
