
const routes = [
  {
    path: '/',
    component: () => import('layouts/PrivateLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ],
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ],
    meta: { redirectToHome: true }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
