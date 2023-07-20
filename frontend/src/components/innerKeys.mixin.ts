import FileUpload from 'primevue/fileupload'
import Password from 'primevue/password'
import type { ComponentCustomProperties } from 'vue'
import {
  GPG_TOOLS_MODULE,
  PRIVATE_KEY_ARMORED,
  PUBLIC_KEY_ARMORED,
} from '../store/gpg-tools'

interface ComponentBase extends ComponentCustomProperties {
  passphrase: string
  isPasswordError: boolean
  focus(o?: FocusOptions): void
  $refs: Record<string, unknown>
}

export default {
  name: 'LoadInnerKeys',
  components: {
    FileUpload,
    Password,
  },
  data() {
    return {
      passphrase: '',
      isPasswordError: false,
    }
  },
  computed: {
    isLoadedKeys<C extends ComponentBase>(this: C) {
      return !!(
        this.$store.state[GPG_TOOLS_MODULE][PRIVATE_KEY_ARMORED] &&
        this.$store.state[GPG_TOOLS_MODULE][PUBLIC_KEY_ARMORED]
      )
    },
  },
  methods: {
    validatePassword<C extends ComponentBase>(this: C) {
      if ((this.isPasswordError = !this.passphrase)) {
        this.focus()
        return this.$t('load_no_passphrase_error')
      }
      if ((this.isPasswordError = this.passphrase.length < 8)) {
        return this.$t('load_passphrase_small_error')
      }
      return ''
    },
    focus<C extends ComponentBase>(this: C, o?: FocusOptions) {
      ;(
        this.$refs as {
          password: {
            $refs: {
              input: {
                $el: HTMLInputElement
              }
            }
          }
        }
      ).password.$refs.input.$el.focus(o)
    },
  },
}
