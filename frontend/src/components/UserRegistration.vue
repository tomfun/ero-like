<template>
  <form class="card">
    <h1 class="flex align-items-center">
      <span class="pi pi-user mr-2"></span>{{ $t('user_registration') }}
    </h1>
    <div class="formgrid grid">
      <div class="field col">
        <PublicKey v-model="publicKeyArmored" />
      </div>
      <div class="field col">
        <label for="clearSignArmored">{{ $t('signature_label') }}</label>
        <Textarea
          v-model="clearSignArmored"
          name="clearSignArmored"
          id="clearSignArmored"
          cols="66"
          rows="16"
          :placeholder="$t('signature_placeholder')"
        />
        <ContentSignature
          content="I read and agree with all terms of use of ero-like and confirm my registration on ero-like"
          :labelText="$t('signature_label')"
          labelFor="clearSignArmored"
        />
      </div>
      <div class="col-12">
        <div class="card flex justify-content-center flex-wrap gap-3">
          <Button @click="submit(true)">{{ $t('check_button') }}</Button>
          <Button @click="submit(false)">{{ $t('submit_button') }}</Button>
        </div>
        <Message severity="error" v-for="error in errors" :key="error">
          {{ error }}
        </Message>
        <Message severity="success" v-if="user.id">
          {{ $t('user_created') }}
        </Message>
        <Message severity="info" v-if="user.agreementSignature.primaryKeyFingerprint">
          <span
            v-html="
              $t('user_info_message', {
                nick: user.nick,
                primaryKeyFingerprint: user.agreementSignature.primaryKeyFingerprint,
              })
            "
          />
          <span
            v-if="
              user.agreementSignature.primaryKeyFingerprint ===
              user.agreementSignature.usedKeyFingerprint
            "
          >
            {{ $t('signature_made_directly') }}
          </span>
          <span v-else>{{
            $t('sub_key_id', {
              usedKeyFingerprint: user.agreementSignature.usedKeyFingerprint,
            })
          }}</span>
        </Message>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { BadRequestError, userRegister } from '../services/api'
import { generateKeys } from '../services/openpgp'
import ContentSignature from './ContentSignature.vue'
import PublicKey from './UserRegistration/PublicKey.vue'

console.log(await generateKeys({ passphrase: '123456' }))
export default defineComponent({
  name: 'UserRegistration',
  components: {
    ContentSignature,
    PublicKey,
  },
  data() {
    return {
      errors: [] as string[],
      user: {
        id: undefined,
        nick: '',
        agreementSignature: {
          block: {},
          data: {},
          publicKey: {},
          primaryKeyFingerprint: '',
          usedKeyFingerprint: '',
        },
      },
      publicKeyArmored: '',
      clearSignArmored: '',
    }
  },
  methods: {
    async submit(check?: boolean) {
      try {
        this.user = await userRegister(this, check)
        this.errors.length = 0
      } catch (e) {
        if (e instanceof BadRequestError) {
          this.errors = e.errors
        } else {
          this.errors = [(e as Error).message]
        }
      }
    },
  },
})
</script>

<style scoped lang="scss">
.card div {
  margin: 0.1em;
}
form:deep(#publicKeyArmored, #clearSignArmored),
textarea {
  min-width: 20em;
  width: 100%;
}
</style>
