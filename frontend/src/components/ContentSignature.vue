<template>
  <TabView
    v-on:tab-change="handleTabChange"
    :activeIndex="softwareTabMap[selectedSoftware]"
  >
    <TabPanel
      :header="$t(`gpg_tool_${s.toLowerCase()}`)"
      v-for="(s, i) in tabToSoftwareMap"
      :key="i"
    >
      <template v-if="s === Software.Linux">
        <p class="m-0" v-html="$t('content_signature_linux_list')" />
        <CopyText content="gpg --list-secret-keys --keyid-format=long" />
        <p class="m-0" v-html="$t('content_signature_linux_command')" />
        <CopyText
          :content="`echo '${contentLinux}' | gpg --clear-sign --disable-signer-uid --local-user <user>`"
          v-if="content"
          @copied="notifyCopied()"
        />
        <p>
          <span v-html="$t('content_signature_linux_command_result')" />&ensp;
          <label :for="labelFor" class="link">"{{ labelText }}"</label>
        </p>
      </template>
      <template v-else-if="s === Software.Inner">
        <LoadInnerKeys />
        <div style="height: 0.5em">
          <ProgressBar v-if="isSigning" mode="indeterminate" style="height: 0.5em" />
        </div>
        <p>{{ isLoadedKeys ? $t('sign_allowed') : $t('sign_you_need_keys') }}</p>
        <div class="w-full" style="padding-top: 0.5em">
          <div class="card flex justify-content-center flex-wrap gap-3">
            <Button
              severity="info"
              :disabled="!isLoadedKeys"
              :title="$t('sign')"
              @click="handleInnerSign"
            >
              <span class="pi pi-key"></span>
              &nbsp;{{ $t('sign') }}
            </Button>
          </div>
        </div>
        <Message severity="error" v-if="errorMessage">
          {{ errorMessage }}
        </Message>
      </template>
    </TabPanel>
  </TabView>
</template>

<script lang="ts">
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import type { TabViewClickEvent } from 'primevue/tabview'
import { defineComponent } from 'vue'
import {
  DecryptPrivateKeyOpenpgpError,
  ReadPrivateKeyOpenpgpError,
  sign,
  SignOpenpgpError,
} from '../services/openpgp'
import {
  ALL_SOFTWARE,
  ALL_SOFTWARE_REV,
  GPG_TOOLS_MODULE,
  PASSPHRASE,
  PRIVATE_KEY_ARMORED,
  PUBLIC_KEY_ARMORED,
  SOFTWARE,
  Software,
} from '../store/gpg-tools'
import { SET_SOFTWARE } from '../store/gpg-tools/mutations'
import { convertError } from '../utils'
import CopyText from './CopyText.vue'
import idMixin from './id.mixin'
import LoadInnerKeys from './LoadInnerKeys.vue'

export default defineComponent({
  mixins: [idMixin],
  name: 'ContentSignature',
  components: {
    TabPanel,
    TabView,
    CopyText,
    LoadInnerKeys,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
    labelText: {
      type: String,
      required: true,
    },
    labelFor: {
      type: String,
      required: true,
    },
  },
  emits: {
    copied() {
      return typeof arguments[0] === 'undefined'
    },
    'update:signature'(str: string) {
      return typeof str === 'string'
    },
  },
  data() {
    return {
      tabToSoftwareMap: ALL_SOFTWARE,
      softwareTabMap: ALL_SOFTWARE_REV,
      Software,
      errorMessage: '',
      isSigning: false,
    }
  },
  computed: {
    isLoadedKeys() {
      return !!(
        this.$store.state[GPG_TOOLS_MODULE][PRIVATE_KEY_ARMORED] &&
        this.$store.state[GPG_TOOLS_MODULE][PUBLIC_KEY_ARMORED]
      )
    },
    contentLinux() {
      return this.content.replace(/'/g, `'\\''`)
    },
    selectedSoftware() {
      return this.$store.state[GPG_TOOLS_MODULE][SOFTWARE]
    },
  },
  methods: {
    setSoftware(v: Software) {
      return this.$store.commit([GPG_TOOLS_MODULE, SET_SOFTWARE].join('/'), v)
    },
    handleTabChange(event: TabViewClickEvent) {
      this.setSoftware(this.tabToSoftwareMap[event.index])
    },
    async handleInnerSign() {
      const privateKeyArmored = this.$store.state[GPG_TOOLS_MODULE][
        PRIVATE_KEY_ARMORED
      ] as string
      const passphrase = this.$store.state[GPG_TOOLS_MODULE][PASSPHRASE]
      this.isSigning = true
      try {
        this.$emit(
          'update:signature',
          await sign({ privateKeyArmored, passphrase }, this.content),
        )
      } catch (e) {
        if (e instanceof ReadPrivateKeyOpenpgpError) {
          this.errorMessage = this.$t(
            'ReadPrivateKeyOpenpgpError',
            e as { message: string },
          )
        } else if (e instanceof DecryptPrivateKeyOpenpgpError) {
          this.errorMessage = this.$t(
            'DecryptPrivateKeyOpenpgpError',
            e as { message: string },
          )
        } else if (e instanceof SignOpenpgpError) {
          this.errorMessage = this.$t('SignOpenpgpError', e as { message: string })
        } else {
          this.errorMessage = this.$t(
            'UnknownError',
            convertError(e) as { message: string },
          )
        }
      } finally {
        this.isSigning = false
      }
    },
    notifyCopied() {
      this.$emit('copied')
    },
  },
})
</script>

<style scoped lang="scss">
label.link {
  font-weight: normal;
  color: #2c3e50;
  text-decoration-line: underline;
  cursor: pointer;

  &:hover {
    color: #42b983;
  }
}
</style>
