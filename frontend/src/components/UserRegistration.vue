<template>
  <form class="card">
    <h1 class="flex align-items-center">
      <span class="pi pi-user mr-2"></span>{{ $t('user_registration') }}
    </h1>
    <div class="formgrid grid">
      <div class="field col">
        <label for="publicKeyArmored">{{ $t('public_key_label') }}</label>
        <Textarea
          v-model="publicKeyArmored"
          cols="66"
          :autoResize="true"
          id="publicKeyArmored"
          name="publicKeyArmored"
          :placeholder="$t('public_key_placeholder')"
        />
        <p>
          {{ $t('public_key_warning') }}
        </p>
        <Panel :header="$t('how_to_get_keys')" toggleable :collapsed="true">
          <p class="m-0" v-html="$t('how_to_get_keys_details')"></p>
        </Panel>
        <Panel :header="$t('how_to_set_public_user')" toggleable :collapsed="true">
          <p class="m-0" v-html="$t('how_to_set_public_user_details')"></p>
        </Panel>
        <p v-html="$t('check_before_sending')"></p>
      </div>
      <div class="field col">
        <label for="clearSignArmored">{{ $t('signature_label') }}</label>
        <Textarea
          v-model="clearSignArmored"
          name="clearSignArmored"
          id="clearSignArmored"
          cols="66"
          :auto-resize="true"
          :placeholder="$t('signature_placeholder')"
        />
        <Panel :header="$t('how_to_clear_sign')" toggleable :collapsed="true">
          <p class="m-0" v-html="$t('how_to_clear_sign_details')"></p>
        </Panel>
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

export default defineComponent({
  name: 'UserRegistration',
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
textarea {
  min-width: 20em;
  width: 100%;
}
</style>
