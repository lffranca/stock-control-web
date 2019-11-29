import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import { STORAGE_AUTH } from '../constants/storage-constant'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem(STORAGE_AUTH)
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        next({
          path: '/login'
        })
      } else {
        next()
      }
    } else if (to.matched.some(record => record.meta.redirectToHome)) {
      if (isAuthenticated) {
        next({
          path: '/'
        })
      } else {
        next()
      }
    } else {
      next()
    }
  })

  return Router
}
