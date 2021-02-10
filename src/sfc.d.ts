declare module '*.vue' {
  import { defineComponent } from '@vue/composition-api'
  const component: ReturnType<typeof defineComponent>
  export default component
}
declare const ROUTES = []

declare module 'uview-ui' {
  import uviewUi from 'uview-ui'
  export default uviewUi
}
