<template>
  <p class="m-0">
    To sign your validated report, first select the user you want to sign the report with.
  </p>
  <p class="m-0">List all users:</p>
  <CopyText content="gpg --list-keys" />
  <p class="m-0">
    Paste in your local CMD the next code replacing $user with your value:
  </p>
  <CopyText
    :content="`echo '${contentLinux}' | gpg --clear-sign --disable-signer-uid --local-user `"
    v-if="content"
    @copied="notifyCopied()"
  />
  <p class="m-0">Copy the result and paste it in the next window.</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CopyText from './CopyText.vue'

export default defineComponent({
  name: 'ContentSignature',
  components: {
    CopyText,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  emits: {
    copied() {
      return typeof arguments[0] === 'undefined'
    },
  },
  data() {
    return {
      uid: Math.random().toString(27).slice(2),
    }
  },
  computed: {
    contentLinux() {
      return this.content.replace(/'/g, `'\\''`)
    },
  },
  methods: {
    id(id: string) {
      return this.uid + id.toString()
    },
    notifyCopied() {
      this.$emit('copied')
    },
  },
})
</script>

<style scoped lang="scss"></style>
