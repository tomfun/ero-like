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
import InputNumber from 'primevue/inputnumber';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import './primeflex.scss';
import App from './App.vue';
import router from './router';
import store from './store';

const i18n = createI18n({
  locale: 'en', // set default locale
  messages: {}, // set empty messages object
});

async function loadLocaleMessages(locale: any) {
  const messages = await import(/* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`);
  i18n.global.setLocaleMessage(locale, messages.default);
  console.log(messages);
  // return nextTick();
}

createApp(App)
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
  .component('InputNumber', InputNumber)
  .use(store)
  .use(router)
  .use(i18n)
  .mount('#app');

  export { i18n, loadLocaleMessages };
