<template>
  <Panel :header="$t('load_inner_keys')" toggleable :collapsed="isLoadedKeys">
    <div v-html="$t('load_feature')"></div>
    <form class="p-buttonset-load formgrid grid-nogutter" @submit="handleLoad">
      <FileUpload
        :title="$t('load')"
        :chooseLabel="$t('load')"
        upload-icon="pi pi-caret-down"
        mode="basic"
        name="keyfile[]"
        :maxFileSize="50000"
        customUpload
        auto
        @uploader="handleUploader"
      />
      <Password
        :class="{ 'p-invalid': isPasswordError }"
        ref="password"
        name="passphrase"
        required
        toggleMask
        v-model="passphrase"
        minlength="8"
        maxlength="64"
      />
      <Button @click="handleLoad" severity="info" type="submit">
        {{ $t('load') }}
      </Button>
    </form>
    <Message severity="error" v-if="errorMessage">
      {{ errorMessage }}
    </Message>
  </Panel>
</template>
<script lang="ts">
import { type FileUploadUploaderEvent } from 'primevue/fileupload'
import { defineComponent } from 'vue'
import {
  DecryptPrivateKeyOpenpgpError,
  ReadPrivateKeyOpenpgpError,
  SignOpenpgpError,
} from '../services/openpgp'
import { GPG_TOOLS_MODULE } from '../store/gpg-tools'
import { type AllData, SET_ALL } from '../store/gpg-tools/actions'
import { convertError } from '../utils'
import innerKeysMixin from './innerKeys.mixin'

export default defineComponent({
  mixins: [innerKeysMixin],
  name: 'LoadInnerKeys',
  emits: {
    'update:publicKey'(item: string) {
      return typeof item === 'string'
    },
  },
  data() {
    return {
      privateKey: '',
      revocationCertificate: '',
      publicKey: '',
      errorMessage: '',
    }
  },
  methods: {
    async handleLoad(event: Event | null = null) {
      if (event && 'preventDefault' in event) {
        event.preventDefault()
      }
      if (!this.publicKey || !this.privateKey || !this.revocationCertificate) {
        this.errorMessage = this.$t('load_no_keys_error')
        return
      }
      if ((this.isPasswordError = !!(this.errorMessage = this.validatePassword()))) {
        return
      }
      const payload: AllData = {
        passphrase: this.passphrase,
        publicKeyArmored: this.publicKey,
        privateKeyArmored: this.privateKey,
        revocationCertificate: this.revocationCertificate,
      }
      try {
        await this.$store.dispatch([GPG_TOOLS_MODULE, SET_ALL].join('/'), payload)
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
          this.isPasswordError = true
        } else if (e instanceof SignOpenpgpError) {
          this.errorMessage = this.$t('SignOpenpgpError', e as { message: string })
        } else {
          this.errorMessage = this.$t(
            'UnknownError',
            convertError(e) as { message: string },
          )
        }
        return
      }

      this.$emit('update:publicKey', this.publicKey)
    },
    async handleUploader(event: FileUploadUploaderEvent) {
      const file: File =
        'length' in event.files ? (event.files as File[])[0] : event.files
      const reader = new FileReader()
      reader.readAsText(file)
      let result: string = await new Promise((r, reject) => {
        reader.onloadend = () => r(reader.result as string)
        reader.onerror = reject
      })
      const endBlock = '-----END PGP PUBLIC KEY BLOCK-----'
      const indexOfEndPublic = result.indexOf(endBlock)
      if (indexOfEndPublic === -1) {
        this.errorMessage = this.$t('load_secure_keys_parse_error')
        return
      }
      this.publicKey = result.slice(0, indexOfEndPublic + endBlock.length)
      result = result.slice(indexOfEndPublic + endBlock.length).trim()

      const endPrivateBlock = '-----END PGP PRIVATE KEY BLOCK-----'
      const indexOfEndPrivate = result.indexOf(endPrivateBlock)
      if (indexOfEndPrivate === -1) {
        this.errorMessage = this.$t('load_secure_keys_parse_error')
        return
      }
      this.privateKey = result.slice(0, indexOfEndPrivate + endPrivateBlock.length)
      this.revocationCertificate = result
        .slice(indexOfEndPrivate + endPrivateBlock.length)
        .trim()
      if (this.passphrase) {
        await this.handleLoad()
      } else {
        this.focus()
      }
    },
  },
})
</script>
<style scoped lang="scss">
.p-buttonset-load {
  display: flex;
  align-items: center;
  :deep(.p-fileupload) {
    display: inline-flex;
    flex: 0 0 auto;
    .p-fileupload-choose {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }
  }
  :deep(.p-password) {
    flex-grow: 1;
    flex-basis: 0;
    display: inline-flex;
    input {
      border-radius: 0;
      width: 100%;
    }
  }
  button.p-button {
    display: inline-flex;
    flex: 0 0 auto;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
}
</style>
