<template>
  <div id="nav-wrapper">
    <header id="nav">
      <nav class="centered-items" v-if="isLocaleLoaded">
        <router-link :to="{ name: 'Home', params: { locale: routerLocale } }">
          {{ $t('home') }}
        </router-link>
        |
        <router-link :to="{ name: 'Reports', params: { locale: routerLocale } }">
          {{ $t('reports') }}
        </router-link>
        |
        <router-link :to="{ name: 'Submit', params: { locale: routerLocale }  }">
          {{ $t('app_submit_report') }}
        </router-link>
      </nav>
      <LocaleSelect/>
    </header>
    <div id="forkme">
      <div class="forkme"><a href="https://github.com/tomfun/ero-like">Fork me on Github</a></div>
    </div>
  </div>
  <main><router-view v-if="isLocaleLoaded"/></main>
  <footer id="nav-footer" v-if="isLocaleLoaded">
    <router-link :to="{ name: 'Home', params: { locale: routerLocale } }">
      {{ $t('home') }}
    </router-link>
    |
    <router-link :to="{ name: 'Reports', params: { locale: routerLocale } }">
      {{ $t('reports') }}
    </router-link>
    |
    <router-link :to="{ name: 'UserRegistration', params: { locale: routerLocale } }">
      {{ $t('app_register') }}
    </router-link>
    |
    <router-link :to="{ name: 'Submit', params: { locale: routerLocale } }">
      {{ $t('app_submit_report') }}
    </router-link>
    |
    <router-link :to="{ name: 'About', params: { locale: routerLocale } }">
      {{ $t('app_about') }}
    </router-link>
    |
    <router-link :to="{ name: 'Terms', params: { locale: routerLocale } }">
      {{ $t('app_terms_of_use') }}
    </router-link>
    <a href="https://pontoon.tomfun.co/projects/ero-like/">
      &#127987; {{ $t('app_add_translations') }}
    </a>
  </footer>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body, #app, html {
  border: none;
  margin: 0;
  padding: 0;
}

main {
  padding: 0 5px;
}
div.center, #nav, #nav-footer {
  text-align: center;
}

$navPadding: 30px;

#nav, #nav-footer {
  padding: $navPadding;

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

$forkMeSizeMax: 80px;
#nav-wrapper {
  display: flex;
  justify-content: end;
  align-items: start;

  #nav, #forkme {
    display: flex;
  }

  #nav {
    width: calc(100% - $forkMeSizeMax - $navPadding);
    padding-right: 0;
  }

  #forkme {
    position: relative;
    overflow: hidden;
    min-width: $forkMeSizeMax;
    min-height: $forkMeSizeMax;
    .forkme {
      transform: rotate(45deg);
      background-color: #FFF;
      overflow: hidden;
      /* position: fixed; */
      position: absolute;
      z-index: 1;
      width: 220px;
      right: -104px;
      top: 29px;
      border-style: solid;
      border-color: #7B7979;
      a {
        color: #404040;
        display: block;
        font: 13px Helvetica Neue, Arial, sans-serif;
        margin: 0.05em 0px 0.075em;
        padding: 0.6em;
        text-align: center;
        text-decoration: none
      }
    }
  }
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
