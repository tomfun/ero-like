import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import AutoComplete from 'primevue/autocomplete';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
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
  .component('AutoComplete', AutoComplete)
  .component('Checkbox', Checkbox)
  .component('Dropdown', Dropdown)
  .component('InputText', InputText)
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
