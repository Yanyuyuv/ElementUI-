import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginCom from '../components/LoginCom.vue'
import HomeCom from '../components/HomeCom.vue'
import Test from '../components/TestTest.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
    // 默认路由
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  },
  {
    path: '/login',
    name: 'login',
    component: LoginCom
  },
  {
    path: '/home',
    name: 'home',
    component: HomeCom
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  routes
})

// 导航守卫
router.beforeEach(function (to, from, next) {
  // 前往登录页
  if (to.path === '/login') return next()
  // 拿token
  const token = window.sessionStorage.getItem('token')
  // 没有token 强制跳转
  if (!token) return next('/login')
  next()
})
// to表示离开的
// from表示去往的
// next就是上面那三个方法
export default router
