/* eslint-disable */
import { FluentBundle } from '@fluent/bundle';

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $tr: FluentBundle;
  }
}
