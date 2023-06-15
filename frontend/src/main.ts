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
import { FluentBundle } from '@fluent/bundle'
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import "flag-icons/css/flag-icons.min.css";
import './primeflex.scss';
import App from './App.vue';
import { createLocale } from './format.js/plugin';
import metaManager from './metaManager';
import router from './router';
import store from './store';

import englishMessages from './locales/en/messages.ftl';

export const app = createApp(App)
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
  .use(createLocale({
    defaultLocale: 'en',
    availableLocales: ['en', 'ru', 'he', 'uk'],
    isShowNotFoundTranslationsWarning: import.meta.env.DEV,
    isFallback: !import.meta.env.DEV,
    async load(locale) {
      const messages = locale === 'en'
        ? { default: englishMessages }
        : await import(/* webpackChunkName: "locale-[request]" */ `./locales/${locale}/messages.ftl`);
      const translations = new FluentBundle(locale);
      translations.addResource(messages.default.rsrs);
      return translations;
    }
  }))
  .use(metaManager)
  .mount('#app');
