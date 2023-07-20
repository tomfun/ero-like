<template>
  <LoadInnerKeys ref="load" @update:publicKey="$emit('update:publicKey', $event)" />
  <Panel :header="$t('generate_inner_keys')" toggleable :collapsed="isLoadedKeys">
    <form class="formgrid grid-nogutter repeat-passwords">
      <div class="field col float-label-spacing">
        <div class="p-float-label">
          <Password
            ref="password"
            :id="id('password-1')"
            :class="{ 'p-invalid': isPasswordError }"
            required
            toggleMask
            v-model="passphrase"
            name="passphrase"
            minlength="8"
            maxlength="64"
            :aria-describedby="id('password-1-help')"
          />
          <label :for="id('password-1')">{{ $t('field_password') }}</label>
        </div>
        <small :id="id('password-1-help')">{{ $t('field_password_help') }}</small>
      </div>
      <div class="field col float-label-spacing">
        <div class="p-float-label">
          <Password
            :id="id('password-2')"
            :class="{ 'p-invalid': isPasswordMatchError }"
            name="passphrase-2"
            v-model="passphrase2"
            :feedback="false"
            minlength="8"
            maxlength="64"
            :aria-describedby="id('password-2-help')"
          />
          <label :for="id('password-2')">{{ $t('field_password_2') }}</label>
        </div>
        <small :id="id('password-2-help')">{{ $t('generating_storing') }}</small>
      </div>
      <div v-html="$t('generating_storing_use_gpg')" />
      <Message severity="warn" v-show="isGenerating">
        {{ $t('generating_secure_keys') }}
      </Message>
      <div style="height: 0.5em">
        <ProgressBar v-if="isGenerating" mode="indeterminate" style="height: 0.5em" />
      </div>
      <div class="w-full" style="padding-top: 0.5em">
        <div class="card flex justify-content-center flex-wrap">
          <a
            ref="generateA"
            @click="handleGenerateKeys"
            @load="handleLoadedGeneratedKeys"
            @loadeddata="handleLoadedGeneratedKeys"
            download="ero-like-keys.txt"
          >
            <Button severity="info" :title="$t('generate')">
              <span class="pi pi-eject"></span>
              &nbsp;{{ $t('generate') }}
            </Button>
          </a>
          <a
            ref="backupA"
            v-show="isGenerated"
            @load="handleLoadedGeneratedKeys"
            @loadeddata="handleLoadedGeneratedKeys"
            @loadstart="handleLoadedGeneratedKeys"
            download="ero-like-keys.txt"
          >
            <small style="line-height: 2em; display: block">
              {{ $t('if_download_is_not_started_click_here') }}
            </small>
          </a>
        </div>
      </div>

      <Message severity="success" v-if="isGenerated">
        {{ $t('generate_after_save') }}
      </Message>
      <Message severity="error" v-if="generateError">
        {{ generateError }}
      </Message>
    </form>
  </Panel>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { generateKeys } from '../../../services/openpgp'
import idMixin from '../../id.mixin'
import innerKeysMixin from '../../innerKeys.mixin'
import LoadInnerKeys from '../../LoadInnerKeys.vue'

export default defineComponent({
  mixins: [idMixin, innerKeysMixin],
  emits: {
    'update:publicKey'(item: string) {
      return typeof item === 'string'
    },
  },
  components: {
    LoadInnerKeys,
  },
  name: 'KeyForLinux',
  data() {
    return {
      isGenerated: false,
      isGenerating: false,
      isPasswordMatchError: false,
      passphrase2: '',
      generateError: '',
    }
  },
  methods: {
    async handleGenerateKeys(event: MouseEvent) {
      if (event.isTrusted) {
        event.preventDefault()
        if ((this.generateError = this.validatePassword())) {
          return
        }
        if ((this.isPasswordMatchError = this.passphrase !== this.passphrase2)) {
          this.generateError = this.$t('passwords_not_match')
          return
        }
      } else {
        return
      }
      this.isGenerating = true
      this.generateError = ''
      // for some reason when web unoptimzdie generateKeys launched
      // I need setTimeout
      await this.$nextTick()
      await new Promise((r) => setTimeout(r, 200))
      await this.$nextTick()
      const keysPromise = generateKeys(this)
      try {
        await keysPromise
      } catch (e) {
        const er = e as Error
        this.generateError = er && er.message ? er.message : (e as string)
        return
      } finally {
        this.isGenerating = false
      }
      const { publicKey, privateKey, revocationCertificate } = await keysPromise
      const data = [publicKey, privateKey, revocationCertificate].join('\n')
      const blob = new Blob([data], { type: 'text/plain' }) // Change the MIME type as needed
      const objectURL = URL.createObjectURL(blob)

      const as = [this.$refs.generateA, this.$refs.backupA] as HTMLAnchorElement[]
      as.forEach((a) => (a.href = objectURL))
      const [a] = as

      a.href = objectURL
      this.isGenerated = true
      a.click() // Simulate the click event
    },
    handleLoadedGeneratedKeys() {
      this.isGenerated = false
      ;[this.$refs.generateA, this.$refs.backupA].forEach((a) =>
        URL.revokeObjectURL((a as HTMLHyperlinkElementUtils).href),
      )
    },
  },
})
</script>
<style scoped lang="scss">
@import '../../../vars.scss';

.formgrid.grid .col.float-label-spacing {
  padding-top: 0.7em;
  margin-top: 0.5em;
}
.repeat-passwords {
  :deep(.p-password) {
    width: 100%;
    input {
      width: 100%;
    }
  }
}
</style>
