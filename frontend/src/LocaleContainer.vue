<template>
  <div id="nav">
    <div class="centered-items">
      <router-link :to="{ name: 'Home', params: { locale: routerLocale } }">Home</router-link>
      |
      <router-link :to="{ name: 'Reports', params: { locale: routerLocale } }">Reports</router-link>
      |
      <router-link :to="{ name: 'Submit', params: { locale: routerLocale }  }">Submit Report
      </router-link>
    </div>
    <LocaleSelect/>
  </div>
  <router-view v-if="isLocaleLoaded"/>
  <div id="nav-footer">
    <router-link :to="{ name: 'Home', params: { locale: routerLocale } }">Home</router-link>
    |
    <router-link :to="{ name: 'Reports', params: { locale: routerLocale } }">Reports</router-link>
    |
    <router-link :to="{ name: 'UserRegistration', params: { locale: routerLocale } }">Register
    </router-link>
    |
    <router-link :to="{ name: 'Submit', params: { locale: routerLocale } }">Submit Report
    </router-link>
    |
    <router-link :to="{ name: 'About', params: { locale: routerLocale } }">About</router-link>
    |
    <router-link :to="{ name: 'Terms', params: { locale: routerLocale } }">Terms of Use Agreement
    </router-link>
  </div>
</template>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

div.center, #nav, #nav-footer {
  text-align: center;
}

#nav, #nav-footer {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#nav {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .centered-items {
    display: flex;
    justify-content: center;
    gap: 10px; // This will add a space between the links
  }
}


#nav-footer {
  border-top: #2c3e50 2px solid;
}

.p-tabview .p-tabview-panels {
  padding: 0;
}
</style>
<script lang="ts">
import type {
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router';
import LocaleSelect from './components/LocaleSelect.vue';

export default {
  name: 'LocaleContainer',
  components: {
    LocaleSelect,
  },
  data() {
    return { isLocaleLoaded: false, routerLocale: '' };
  },
  computed: {
    implicitLocale() {
      return this.$locale.locale
    }
  },
  setup() {
    const html = document.querySelector('html');
    if (!html) {
      throw new Error('Implement language changing')
    }
    return { html };
  },
  mounted() {
    this.$router.beforeEach(this.beforeEnter);
  },
  watch: {
    '$route.params.locale': {
      async handler(locale: string) {
        if (!this.$locale.options.availableLocales.includes(locale)) {
          return;
        }
        this.routerLocale = locale || '';
        if (!locale) {
          return;
        }
        await this.$locale.loadTranslations(locale)
        this.$locale.localeRef.value = locale;
      },
    },
    'implicitLocale': {
      immediate: true,
      async handler(locale: string) {
        const newLocale = locale || this.implicitLocale
        this.isLocaleLoaded = false;
        await this.$locale.load
        if (this.$locale.locale === newLocale) {
          this.isLocaleLoaded = true;
          this.html.setAttribute('lang', newLocale)
        }
      },
    },
  },
  methods: {
    async beforeEnter(to: RouteLocationNormalized, _from: unknown, next: NavigationGuardNext) {
      const { locale } = to.params
      if (!locale) {
        return next()
      }
      if (locale instanceof Array || !this.$locale.options.availableLocales.includes(locale)) {
        return next({
          ...to,
          params: {
            ...to.params,
            locale: this.routerLocale, // current optional explicit locale
          }
        })
      }
      await this.$locale.loadTranslations(locale)
      return next()
    }
  }
};
</script>
