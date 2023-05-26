<template>

  <form class="card">
    <h1 class="flex align-items-center">
      <span class="pi pi-user mr-2"></span>User Registration
    </h1>
    <div class="formgrid grid">
      <div class="field col">
        <label for="publicKeyArmored">Public key (gpg public key block)</label>
        <Textarea v-model="publicKeyArmored"
                  cols="66"
                  :autoResize="true"
                  id="publicKeyArmored"
                  name="publicKeyArmored"
                  placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----

mQINBF//CqwBEADQ622oqnAs9qFAH8sM0rXo+U8BOg95G8/16awsPsOPjdV1kxNs
nAoFL1Xt5HCELslo4S6vjNMtIHLm6Jw3Hu0sUlfW81lu+q53XhFZcP22HB/MIRhD
....
   .
   .
....
1Rzrx1yFHF7oKiNmI8TLejQ=
=O9gO
-----END PGP PUBLIC KEY BLOCK-----"/>
        <p>
          ! This information is public! When you upload your public key it's irreversible
        </p>
        <Panel header="How to get keys" toggleable :collapsed="true">
          <p class="m-0">
            You need to know id of key or user:<br/>
            <code>gpg --list-keys</code><br/>
            <a
              href="https://docs.github.com/en/authentication/managing-commit-signature-verification/checking-for-existing-gpg-keys">
              Detailed instructions
            </a>. If you <a
            href="https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key">
            don't have yet keys you can <b>create</b>
          </a> them after you have decided which user to use you need to print you public keys and
            user data:<br/>
            <code>gpg --armor --export </code><b>$user</b><br/>
            For example if your key is <code>DD45FA4DC50F85F1</code>:<br/>
            <code>gpg --armor --export DD45FA4DC50F85F1</code><br/>
            For example if your user is "<code>user</code>":<br/>
            <code>gpg --armor --export user</code><br/>
            After that you have to select all text result, copy, and paste it in the field above.
            <br/>
          </p>
        </Panel>
        <Panel header="How to set public user" toggleable :collapsed="true">
          <p class="m-0">
            gpg and ero-like needs username. However we don't need email and there is no
            verification for a moment. You may add new name for your secret key and hide other names
            and emails.
            Edit your user names you can with:<br/>
            <code>gpg --edit-key </code><b>$user</b><br/>
            <a
              href="https://github.com/tomfun/ero-like/blob/ff66d8a21689ae5393a65c0b9e8c990649c7a73b/README-gpg.md#edit-names-and-email">
              more details here
            </a>.
            To filter out any user containing @ (email):<br/>
            <code>gpg --export-filter keep-uid='uid!~@' --armor --export </code><b>$user</b>
            <br/>
            <a
              href="https://github.com/tomfun/ero-like/blob/ff66d8a21689ae5393a65c0b9e8c990649c7a73b/README-gpg.md#export-your-key">
              details here
            </a>.
          </p>
        </Panel>
        <p>
          ! Before sending information you may see all data you will send:
          <code>gpg --armor --export DD45FA4DC50F85F1 | gpg --list-packets</code><br/>
        </p>
      </div>
      <div class="field col">
        <label for="clearSignArmored">Signature (gpg clear-sign output)</label>
        <Textarea v-model="clearSignArmored"
                  name="clearSignArmored"
                  id="clearSignArmored"
                  cols="66"
                  :auto-resize="true"
                  placeholder="-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

I read and agree with all terms of use of ero-like and confirm my registration on ero-like
-----BEGIN PGP SIGNATURE-----

iQIzBAABCgAdFiEEVUcfD9jeufsD1JVP3UX6TcUPhfEFAmC7Q2gACgkQ3UX6TcUP
....
   .
   .
....
TaVHnbJ8jErfklgnRTPibX8AdmEFJasONNMJ/7euoBoH+aAYG/k=
=B0/L
-----END PGP SIGNATURE-----"/>
        <Panel header="How do clear sign" toggleable :collapsed="true">
          <p class="m-0">
            You need to know public key id or your local user which was used to export public key.
            Follow for instructions for the another field [gpg public key]<br/>
            <code>gpg --list-keys</code><br/>
            <a
              href="https://docs.github.com/en/authentication/managing-commit-signature-verification/checking-for-existing-gpg-keys">
              Detailed instructions
            </a>. After you had decided which user to use you need to use it instead of $user:<br/>
            <code>echo -e 'I read and agree with all terms of use of ero-like and confirm my
              registration on ero-like' | gpg --clear-sign --disable-signer-uid --local-user </code>
            <b>$user</b>
            <code>
              - </code><br/>
            After that you have to select all text result, copy, and paste it in the field above.
          </p>
        </Panel>
      </div>
      <div class="col-12">
        <div class="card flex justify-content-center flex-wrap gap-3">
          <Button @click="submit(true)" severity="secondary">Check</Button>
          <Button @click="submit(false)">Submit</Button>
        </div>
        <Message severity="error" v-for="(error) in errors" :key="error">
          {{ error }}
        </Message>
        <Message severity="success" v-if="user.id">
          user created!
        </Message>
        <Message severity="info" v-if="user.agreementSignature.primaryKeyFingerprint">
          user: {{ user.nick }}<br>
          private key id: {{ user.agreementSignature.primaryKeyFingerprint }}<br>
          <span
v-if="user.agreementSignature.primaryKeyFingerprint === user.agreementSignature.usedKeyFingerprint"
          >
            signature made by private key
          </span>
          <span
            v-else>sub key id: {{ user.agreementSignature.usedKeyFingerprint }}</span>
        </Message>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UserRegistration',
  data() {
    return {
      errors: [] as string[],
      user: {
        id: undefined,
        nick: undefined,
        agreementSignature: {
          block: {},
          data: {},
          publicKey: {},
          primaryKeyFingerprint: undefined,
          usedKeyFingerprint: undefined,
        },
      },
      publicKeyArmored: '',
      clearSignArmored: '',
    };
  },
  methods: {
    async submit(check?: boolean) {
      const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKeyArmored: this.publicKeyArmored,
          clearSignArmored: this.clearSignArmored,
        }),
      };
      const response = await fetch(`/api/user${check ? '/dry-run' : ''}`, requestOptions);
      if (response.status === 400) {
        const { message } = await response.json();
        this.errors = typeof message === 'string' ? [message] : message;
        return;
      }
      if (response.status !== 201) {
        this.errors = ['Unknown error'];
        return;
      }
      this.user = await response.json();
      this.errors.length = 0;
    },
  },
});
</script>

<style scoped lang="scss">
textarea {
  min-width: 20em;
  width: 100%;
}
</style>
