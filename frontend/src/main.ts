import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import PrimeVue from 'primevue/config';
import Dropdown from 'primevue/dropdown';
import Fieldset from 'primevue/fieldset';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Paginator from 'primevue/paginator';
import Panel from 'primevue/panel';
import ProgressBar from 'primevue/progressbar';
import Textarea from 'primevue/textarea';
import { createApp } from 'vue';

// eslint-disable-next-line import/no-absolute-path
import '/node_modules/primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';

import App from './App.vue';
import router from './router';
import store from './store';

import './assets/main.css';

const app = createApp(App);

app
  .use(PrimeVue)
  .component('AutoComplete', AutoComplete)
  .component('Button', Button)
  .component('Calendar', Calendar)
  .component('Checkbox', Checkbox)
  .component('Dropdown', Dropdown)
  .component('Fieldset', Fieldset)
  .component('InputText', InputText)
  .component('Message', Message)
  .component('Paginator', Paginator)
  .component('Panel', Panel)
  .component('ProgressBar', ProgressBar)
  .component('Textarea', Textarea)
  .use(router);

app.mount('#app');
