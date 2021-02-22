import { RouterMount, createRouter, runtimeQuit, totalNextRoute } from 'uni-simple-router'
import { minCache } from '@/utils/MinCache'

const router = createRouter({
  h5: {
    paramsToQuery: true,
    vueRouterDev: false, //完全使用vue-router开发 默认 false
  },
  platform: process.env.VUE_APP_PLATFORM as any,
  routerErrorEach: ({ type, msg }) => {
    console.log({ type, msg })
    // #ifdef APP-PLUS
    if (type === 3) {
      router.$lockStatus = false
      runtimeQuit()
    }
    // #endif
  },
  routes: [
    ...ROUTES,
    {
      path: '*',
      redirect: (to: totalNextRoute) => {
        return { name: 'index' }
      },
    },
  ],
})
//全局路由前置守卫
router.beforeEach((to: totalNextRoute, from: totalNextRoute, next) => {
  const token = minCache.get('token')
  if (token || to.name == 'login') {
    next()
  } else {
    next({ name: 'login' })
  }
})
// 全局路由后置守卫
router.afterEach((to: totalNextRoute, from: totalNextRoute) => {
  // console.log(to, '跳转结束')
})

export { router, RouterMount }
