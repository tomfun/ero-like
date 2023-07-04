<template>
  <span
    :class="{
      grid: true,
      'grid-nogutter': true,
      'p-buttonset': true,
      'time-wrapper': true,
      'p-inputwrapper-filled': isFill,
      'p-inputwrapper-focus': isFocus,
    }"
  >
    <Button
      class="col-fixed"
      @:click="minusHandler"
      @:touchstart="mouseHandler(true, false)"
      @:touchend="mouseHandler(false, false)"
      @:mousedown="mouseHandler(true, false)"
      @:mouseup="mouseHandler(false, false)"
    >
      <span class="pi pi-minus"></span>
    </Button>
    <InputMask
      :style="`min-width: ${0.8 + (inputMinWidth * 7.93) / 14}rem`"
      :mask="timeSecondMask"
      :placeholder="timeSecondPlaceholder"
      :inputId="inputId"
      v-model="timeSecond"
      :minFractionDigits="0"
      @:focus="focusHandler"
      @:blur="blurHandler"
      @:keydown="keydownHandler"
    />
    <Button
      class="col-fixed"
      @:click="plusHandler"
      @:mousedown="mouseHandler(true, true)"
      @:mouseup="mouseHandler(false, true)"
      @:touchstart="mouseHandler(true, true)"
      @:touchend="mouseHandler(false, true)"
    >
      <span class="pi pi-plus"></span>
    </Button>
  </span>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

type ConfigPart = {
  length: number
  div: number | null
  c: string | number
  mask: string
}

const CONFIGS = {
  long: [
    { length: 3, div: 24 * 3600, c: '-', mask: 'd' },
    { length: 2, div: 3600, c: ':', mask: 'H' },
    { length: 2, div: 60, c: ':', mask: 'M' },
    { length: 2, div: null, c: null, mask: 'S' },
  ] as ConfigPart[],
  precise: [
    { length: 2, div: 3600, c: ':', mask: 'H' },
    { length: 2, div: 60, c: ':', mask: 'M' },
    { length: 2, div: null, c: null, mask: 'S' },
  ] as ConfigPart[],
  short: [
    { length: 2, div: 3600, c: ':', mask: 'H' },
    { length: 2, div: 60, c: null, mask: 'M' },
  ] as ConfigPart[],
}

export type TimeFormat = keyof typeof CONFIGS

export function getter(this: {
  modelValue: number
  timeFormat: TimeFormat
  prefix: string
}): string | undefined {
  const timeSecond = this.modelValue
  return CONFIGS[this.timeFormat].reduce((str, conf, i, configs) => {
    const div = conf.div || 1
    const mod = ((configs[i - 1] && configs[i - 1].div) || Number.MAX_SAFE_INTEGER) / div
    const c = conf.c || ''
    return (
      str + (Math.floor(timeSecond / div) % mod).toString().padStart(conf.length, '0') + c
    )
  }, this.prefix)
}

export default defineComponent({
  name: 'InputMaskTime',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    allow0: {
      type: Boolean,
      default: true,
    },
    inputId: {
      type: String,
    },
    timeFormat: {
      type: String as PropType<TimeFormat>,
      default: function () {
        return 'long' as TimeFormat
      },
      validator(value) {
        return !!value && Object.keys(CONFIGS).includes(value as string)
      },
    },
    prefix: {
      type: String,
      default: function () {
        return '+T'
      },
    },
  },
  emits: ['update:modelValue'],
  mounted() {
    window && window.addEventListener('mouseup', this.windowHandler)
    window && window.addEventListener('touchend', this.windowHandler)
  },
  beforeUnmount() {
    window && window.removeEventListener('mouseup', this.windowHandler)
    window && window.removeEventListener('touchend', this.windowHandler)
  },
  data() {
    return {
      timeSecondRaw: undefined as string | undefined,
      isFocus: false,
      windowHandler: () => this.mouseHandler(),
      interval: null as ReturnType<typeof setInterval> | null,
      timeoutInitDelay: null as ReturnType<typeof setTimeout> | null,
      timeoutWarpDelay: null as ReturnType<typeof setTimeout> | null,
    }
  },
  computed: {
    isEmpty() {
      return (
        [null, undefined].includes(this.modelValue as unknown as null) ||
        (!this.allow0 && this.modelValue === 0)
      )
    },
    isFill() {
      return !this.isEmpty || this.timeSecondRaw
    },
    timeSecond: {
      get(): string | undefined {
        if (this.isEmpty) {
          return this.timeSecondRaw
        }
        return getter.call(this)
      },
      set(value: string) {
        this.timeSecondRaw = value || undefined
        if (!value) {
          this.setNewValue(0)
          return
        }
        const pattern = CONFIGS[this.timeFormat].reduce((pattern, conf) => {
          const digitPattern = `(\\d{${conf.length}})`
          const separator = conf.c ? `${conf.c}` : ''
          return pattern + digitPattern + separator
        }, '')

        const match = value.replace(this.prefix, '').match(new RegExp(pattern))
        if (!match) {
          return
        }
        const timeSecond = CONFIGS[this.timeFormat].reduce(
          (n: number, conf, i: number) => n + (conf.div || 1) * +match[i + 1],
          0,
        )
        this.setNewValue(timeSecond)
      },
    },
    inputMinWidth() {
      return this.timeSecondMask.length
    },
    timeSecondMask() {
      return CONFIGS[this.timeFormat].reduce((mask, conf) => {
        const maskPart = new Array(conf.length).fill('9').join('')
        const separator = conf.c ? `${conf.c}` : ''
        return mask + maskPart + separator
      }, this.prefix)
    },
    timeSecondPlaceholder() {
      return CONFIGS[this.timeFormat].reduce((mask, conf) => {
        const maskPart = new Array(conf.length).fill(conf.mask).join('')
        const separator = conf.c ? `${conf.c}` : ''
        return mask + maskPart + separator
      }, this.prefix)
    },
  },
  methods: {
    plusHandler() {
      this.setNewValue(this.modelValue + 60)
    },
    minusHandler() {
      this.setNewValue(this.modelValue - 60)
    },
    mouseHandler(isDown = false, isPlus = false) {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
      if (this.timeoutWarpDelay) {
        clearTimeout(this.timeoutWarpDelay)
        this.timeoutWarpDelay = null
      }
      if (this.timeoutInitDelay) {
        clearTimeout(this.timeoutInitDelay)
        this.timeoutInitDelay = null
      }
      if (isDown) {
        this.timeoutInitDelay = setTimeout(() => {
          this.interval = setInterval(
            () => this.setNewValue(this.modelValue + (isPlus ? 1 : -1) * 60),
            60,
          )
        }, 750)
        let warp = 1
        this.timeoutWarpDelay = setTimeout(() => {
          this.interval && clearInterval(this.interval)
          this.interval = setInterval(() => {
            warp += 0.1
            this.setNewValue(this.modelValue + (isPlus ? 1 : -1) * Math.floor(warp) * 60)
          }, 60)
        }, 2000)

        return
      }
    },
    focusHandler() {
      this.isFocus = true
    },
    blurHandler() {
      this.isFocus = false
    },
    keydownHandler(event: KeyboardEvent) {
      if (event.altKey || event.metaKey || !event.isTrusted) {
        return
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
        return
      }
      event.preventDefault()
      let step = event.ctrlKey || event.shiftKey ? 3600 : 60
      step *= event.key === 'ArrowDown' ? -1 : 1
      this.setNewValue(this.modelValue + step)
    },
    setNewValue(value: number) {
      this.$emit('update:modelValue', value)
    },
  },
})
</script>

<style scoped lang="scss">
@import '../vars.scss';

.time-wrapper > .p-inputtext {
  border-radius: 0;
  order: 2;

  display: flex;
  flex-grow: 1;
  flex-basis: 0;
  padding: $gutter;
  width: calc(100% - $buttonWidth - $buttonWidth);
}
.time-wrapper {
  display: flex;
  font-size: 1rem;
  flex-wrap: nowrap;
  .p-button {
    display: flex;
    &:first-child {
      order: 1;
    }
    &:last-child {
      order: 3;
      border-left: none;
    }
    flex: 0 0 auto;
    width: $buttonWidth;
    padding: 0.5rem 0;
    justify-content: center;
    //display: inline-flex;
    box-sizing: border-box;
  }
}
</style>

<style lang="scss">
.p-float-label .time-wrapper ~ label {
  left: 44px;
}
.p-float-label .time-wrapper.p-inputwrapper-filled ~ label,
.p-float-label .time-wrapper.p-inputwrapper-focus ~ label {
  left: 0;
}
</style>
