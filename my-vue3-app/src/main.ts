import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Paginator from 'primevue/paginator';
import ProgressBar from 'primevue/progressbar';
import App from './App.vue';
import router from './router';
import store from './store';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

createApp(App)
  .use(PrimeVue)
  .component('Paginator', Paginator)
  .component('ProgressBar', ProgressBar)
  .use(store)
  .use(router)
  .mount('#app');

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $store: typeof store;
  }
}
