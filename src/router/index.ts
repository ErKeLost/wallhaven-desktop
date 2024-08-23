import { Router, createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/layout/home'
    },
    ...routes
  ]
})


router.beforeEach(() => {
  LoadingBar.start()
})

router.afterEach(() => {
  LoadingBar.finish()
})

export default router
