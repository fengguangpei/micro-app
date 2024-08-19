interface Window {
  __POWERED_BY_QIANKUN__: boolean
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string
  __MICRO_APP_ENVIRONMENT__: boolean
  $parentRouter: Router
  Vue: Vue
}
declare let __webpack_public_path__: string
declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: returnType<typeof defineComponent>
  export default component
}
