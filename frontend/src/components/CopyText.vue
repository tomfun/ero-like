<template>
  <span :class="['grid copy-paste-wrapper', { 'p-inputwrapper-focus': false }]">
    <span class="tooltip" v-if="tooltipText">{{ tooltipText }}</span>
    <Textarea
      rows="1"
      :contenteditable="false"
      :value="content"
      autoResize
      ref="textArea"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    />
    <Button class="col-fixed text-center" @:click="copyHandler">
      <span class="pi pi-copy"></span>
    </Button>
  </span>
</template>

<script lang="ts">
import { defineComponent, type ComponentPublicInstance } from 'vue'

export default defineComponent({
  name: 'CopyText',
  props: {
    content: {
      type: String,
      required: true,
    },
    tooltipMaxLength: {
      type: Number,
      default: 66,
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
      copied: null as string | null,
      tooltipText: '',
    }
  },
  methods: {
    id(id: string) {
      return this.uid + id.toString()
    },
    notifyCopied() {
      this.$emit('copied')
    },
    async copyHandler() {
      const ta: HTMLTextAreaElement = (this.$refs.textArea as ComponentPublicInstance).$el
      ta.focus()
      ta.select()
      ta.setSelectionRange(0, 99999)
      const copied = ta.value
      try {
        await navigator.clipboard.writeText(copied)
        this.copied = copied
        this.notifyCopied()
      } catch (e) {
        this.tooltipText = 'Not copied'
      }
      await this.$nextTick()
      if (this.copied !== null) {
        const sliced =
          this.copied.slice(0, this.tooltipMaxLength) +
          (this.copied.length > this.tooltipMaxLength ? '...' : '')
        this.tooltipText = `Copied: ${sliced}`
      }
    },
  },
})
</script>

<style scoped lang="scss">
@import '../vars.scss';
.copy-paste-wrapper {
  position: relative;
  margin-right: 0;
  margin-left: 0;
  margin-top: 0;

  textarea {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    display: flex;
    flex-grow: 1;
    flex-basis: 0;
    padding: $gutter;
    //  width: calc(100% - $buttonWidth);
  }

  button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .tooltip {
    visibility: hidden;
    width: 60%;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 100%;
    left: 20%;
    //margin-left: -75px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }

  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
}
</style>
