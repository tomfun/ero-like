<template>
  <label for="publicKeyArmored">{{ $t('public_key_label') }}</label>
  <Textarea
    :modelValue="modelValue"
    @update:modelValue="setNewValue"
    cols="66"
    class="w-full"
    rows="10"
    id="publicKeyArmored"
    name="publicKeyArmored"
    placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----
mQINBF//CqwBEADQ622oqnAs9qFAH8sM0rXo+U8BOg95G8/16awsPsOPjdV1kxNs
•••
  •
  •
  •
•••
=O9gO
-----END PGP PUBLIC KEY BLOCK-----"
  />
  <p>
    {{ $t('public_key_warning') }}
  </p>
  <TabView
    v-on:tab-change="handleTabChange"
    :activeIndex="softwareTabMap[selectedSoftware]"
  >
    <TabPanel
      :header="$t(`gpg_tool_${s.toLowerCase()}`)"
      v-for="(s, i) in tabToSoftwareMap"
      :key="i"
    >
      <component :is="softwareToComponentMap[s]" />
    </TabPanel>
  </TabView>
</template>

<script lang="ts">
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import type { TabViewClickEvent } from 'primevue/tabview'
import { defineComponent } from 'vue'
import { generateKeys } from '../../services/openpgp'
import {
  Software,
  ALL_SOFTWARE,
  ALL_SOFTWARE_REV,
  GPG_TOOLS_MODULE,
  SOFTWARE,
} from '../../store/gpg-tools'
import { SET_SOFTWARE } from '../../store/gpg-tools/actions'
import KeyForLinux from './PublicKey/KeyForLinux.vue'

const softwareToComponentMap = {
  [Software.Linux]: KeyForLinux,
  [Software.Inner]: KeyForLinux, // todo
}

console.log(await generateKeys({ passphrase: '123456' }))

export default defineComponent({
  name: 'PublicKey',
  components: {
    TabPanel,
    TabView,
    KeyForLinux,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: {
    'update:modelValue'(item: string) {
      return typeof item === 'string'
    },
  },
  data() {
    return {
      uid: Math.random().toString(27).slice(2),
      tabToSoftwareMap: ALL_SOFTWARE,
      softwareTabMap: ALL_SOFTWARE_REV,
      softwareToComponentMap,
      Software,
    }
  },
  computed: {
    selectedSoftware() {
      return this.$store.state[GPG_TOOLS_MODULE][SOFTWARE]
    },
  },
  methods: {
    setSoftware(v: Software) {
      return this.$store.commit([GPG_TOOLS_MODULE, SET_SOFTWARE].join('/'), v)
    },
    id(id: string) {
      return this.uid + id.toString()
    },
    setNewValue(value: string) {
      this.$emit('update:modelValue', value)
    },
    handleTabChange(event: TabViewClickEvent) {
      this.setSoftware(this.tabToSoftwareMap[event.index])
    },
  },
})
</script>
