<template>
  <slot name="header" :isLocaleLoaded="isLocaleLoaded" :locale="routerLocale">
    <LocaleSelect/>
  </slot>
  <slot v-if="isLocaleLoaded" :isLocaleLoaded="isLocaleLoaded" :locale="routerLocale">
    <router-view/>
  </slot>
</template>

<script lang="ts">
import { useMeta } from 'vue-meta';
import type {
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router';
import LocaleSelect from './LocaleSelect.vue';

export default {
  name: 'LocaleContainer',
  components: {
    LocaleSelect,
  },
  data() {
    return { isLocaleLoaded: false, routerLocale: '' };
  },
  setup () {
    const { meta } = useMeta({})
    return { meta }
  },
  computed: {
    implicitLocale() {
      return this.$locale.locale
    }
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
          this.meta.htmlAttrs = {
            lang: newLocale,
          }
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
