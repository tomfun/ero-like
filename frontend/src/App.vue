<template>
  <metainfo>
    <!--suppress VueUnrecognizedSlot -->
    <template v-slot:title="{ content = '' }">
      {{ content ? `${content} | Ero Like` : `Ero Like` }}
    </template>
  </metainfo>
  <LocaleContainer>
    <template v-slot:header="{ isLocaleLoaded, locale }">
      <div id="nav-wrapper">
        <header id="nav">
          <nav class="centered-items" v-if="isLocaleLoaded">
            <router-link :to="{ name: 'Home', params: { locale } }">
              {{ $t('home') }}
            </router-link>
            |
            <router-link :to="{ name: 'Reports', params: { locale } }">
              {{ $t('reports') }}
            </router-link>
            |
            <router-link :to="{ name: 'Submit', params: { locale } }">
              {{ $t('app_submit_report') }}
            </router-link>
            &nbsp;<!-- <-~ я верстальщик от бога -->
          </nav>
          <LocaleSelect />
        </header>
        <div id="forkme">
          <div class="forkme">
            <a href="https://github.com/tomfun/ero-like">Fork me on Github</a>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:default="{ isLocaleLoaded, locale }">
      <main><router-view v-if="isLocaleLoaded" /></main>
      <footer id="nav-footer" v-if="isLocaleLoaded">
        <router-link :to="{ name: 'Home', params: { locale } }">
          {{ $t('home') }}
        </router-link>
        |
        <router-link :to="{ name: 'Reports', params: { locale } }">
          {{ $t('reports') }}
        </router-link>
        |
        <router-link :to="{ name: 'UserRegistration', params: { locale } }">
          {{ $t('app_register') }}
        </router-link>
        |
        <router-link :to="{ name: 'Submit', params: { locale } }">
          {{ $t('app_submit_report') }}
        </router-link>
        |
        <router-link :to="{ name: 'About', params: { locale } }">
          {{ $t('app_about') }}
        </router-link>
        |
        <router-link :to="{ name: 'Terms', params: { locale } }">
          {{ $t('app_terms_of_use') }}
        </router-link>
        <a href="https://pontoon.tomfun.co/projects/ero-like/">
          &#127987;&nbsp;{{ $t('app_add_translations') }}
        </a>
        <a
          title="copy address helper link to you i2p browser"
          href="http://ero-like.i2p/?i2paddresshelper=KacMdQOREp5aaYr6DmU6JCt4F9Db3gfPaIvrwYYPlykppwx1A5ESnlppivoOZTokK3gX0NveB89oi-vBhg-XKSmnDHUDkRKeWmmK-g5lOiQreBfQ294Hz2iL68GGD5cpKacMdQOREp5aaYr6DmU6JCt4F9Db3gfPaIvrwYYPlykppwx1A5ESnlppivoOZTokK3gX0NveB89oi-vBhg-XKSmnDHUDkRKeWmmK-g5lOiQreBfQ294Hz2iL68GGD5cpKacMdQOREp5aaYr6DmU6JCt4F9Db3gfPaIvrwYYPlykppwx1A5ESnlppivoOZTokK3gX0NveB89oi-vBhg-XKSmnDHUDkRKeWmmK-g5lOiQreBfQ294Hz2iL68GGD5cpKacMdQOREp5aaYr6DmU6JCt4F9Db3gfPaIvrwYYPlykppwx1A5ESnlppivoOZTokK3gX0NveB89oi-vBhg-XKaOfiDskfhZWWQzo82rc~cjnIqTN13o64vJsXdWdXpYkBQAEAAcAAA=="
        >
          📄ero-like.i2p
        </a>
        |
        <a
          title="instructions for i2p"
          href="https://github.com/tomfun/ero-like/blob/main/i2p.md"
        >
          i2p usage
        </a>
      </footer>
    </template>
  </LocaleContainer>
</template>
<script setup lang="ts">
import LocaleSelect from './format.js/LocaleSelect.vue'
import LocaleContainer from './format.js/LocaleContainer.vue'
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  min-width: 380px;
  width: 100%;
}

body,
#app,
html {
  border: none;
  margin: 0;
  padding: 0;
}

main {
  padding: 0 5px;
}
div.center,
#nav,
#nav-footer {
  text-align: center;
}

$navPadding: 30px;

#nav,
#nav-footer {
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

$forkMeSizeMax: 40px;
#nav-wrapper {
  display: flex;
  justify-content: start;
  align-items: start;

  #nav,
  #forkme {
    display: flex;
  }

  #nav {
    width: calc(100% - $forkMeSizeMax - $navPadding);
    padding-right: 0;
  }
  width: 100%;
  overflow: hidden;

  #forkme {
    position: relative;
    min-width: $forkMeSizeMax;
    min-height: 28px;
    .forkme {
      transform: rotate(45deg);
      background-color: #fff;
      overflow: hidden;
      position: absolute;
      z-index: 1;
      width: 220px;
      right: -119px;
      top: 18px;
      border-style: solid;
      border-color: #7b7979;
      transition: 0.3s;
      transition-property: right, top;
      &:hover {
        right: -114px;
        top: 23px;
      }
      a {
        color: #404040;
        display: block;
        font: 13px Helvetica Neue, Arial, sans-serif;
        margin: 0.05em 0px 0.075em;
        padding: 0.6em;
        text-align: center;
        text-decoration: none;
      }
    }
  }
}
</style>
