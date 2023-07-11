<template>
  <Panel :header="$t('how_to_get_keys')" toggleable :collapsed="false">
    <p v-html="$t('how_to_get_keys_details_list')"></p>
    <CopyText content="gpg --list-secret-keys --keyid-format=long" />
    <p v-html="$t('how_to_get_keys_details_list_instructions')"></p>
    <p v-html="$t('how_to_get_keys_details_create')"></p>
    <CopyText content="gpg --full-generate-key" />
    <p v-html="$t('how_to_get_keys_details_export')"></p>
    <CopyText content="gpg --armor --export <user>" />
    <p v-html="$t('how_to_get_keys_details_copy')"></p>
  </Panel>
  <Panel :header="$t('how_to_set_public_user')" toggleable>
    <p v-html="$t('how_to_set_public_user_details')"></p>
    <CopyText content="gpg --export-filter keep-uid='uid!~@' --armor --export <user>" />
  </Panel>
  <p v-html="$t('check_before_sending')"></p>
  <CopyText content="gpg --armor --export <user> | gpg --list-packets" />
</template>
<script setup lang="ts">
import CopyText from '../../CopyText.vue'
</script>
