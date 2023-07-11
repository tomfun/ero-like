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
      <template v-else-if="s === Software.Inner">inner</template>
    </TabPanel>
  </TabView>
</template>

<script lang="ts">
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import type { TabViewClickEvent } from 'primevue/tabview'
import { defineComponent } from 'vue'
import {
  ALL_SOFTWARE,
  ALL_SOFTWARE_REV,
  GPG_TOOLS_MODULE,
  SOFTWARE,
  Software,
} from '../store/gpg-tools'
import { SET_SOFTWARE } from '../store/gpg-tools/mutations'
import CopyText from './CopyText.vue'

export default defineComponent({
  name: 'ContentSignature',
  components: {
    TabPanel,
    TabView,
    CopyText,
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
  },
  data() {
    return {
      uid: Math.random().toString(27).slice(2),
      tabToSoftwareMap: ALL_SOFTWARE,
      softwareTabMap: ALL_SOFTWARE_REV,
      Software,
    }
  },
  computed: {
    contentLinux() {
      return this.content.replace(/'/g, `'\\''`)
    },
    selectedSoftware() {
      return this.$store.state[GPG_TOOLS_MODULE][SOFTWARE]
    },
  },
  methods: {
    id(id: string) {
      return this.uid + id.toString()
    },
    setSoftware(v: Software) {
      return this.$store.commit([GPG_TOOLS_MODULE, SET_SOFTWARE].join('/'), v)
    },
    handleTabChange(event: TabViewClickEvent) {
      this.setSoftware(this.tabToSoftwareMap[event.index])
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
