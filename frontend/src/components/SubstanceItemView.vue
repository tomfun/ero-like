<template>
  <p class="col-3 min-w-min" :title="modelValue.routeOfAdministration">
    <span class="pi pi-user-plus"></span>
    <ReportTime
      :modelValue="modelValue.timeSecond"
      :timeFormat="timeFormat"
    />
    {{ roaSymbol }}
    <span :class="{ pi: true,
      'pi-apple': modelValue.routeOfAdministration === 'oral',
      'pi-power-off': modelValue.routeOfAdministration === 'sublingual',
      'pi-caret-up': modelValue.routeOfAdministration === 'insufflated',
      'pi-arrow-down-left': modelValue.routeOfAdministration === 'intravenous',
      'pi-comment': modelValue.routeOfAdministration === 'smoked',
      'pi-angle-double-up': modelValue.routeOfAdministration === 'rectal',
      'pi-step-backward-alt': modelValue.routeOfAdministration === 'transdermal',
      'pi-arrow-circle-up': modelValue.routeOfAdministration === 'intramuscular',
      'pi-eye': modelValue.routeOfAdministration === 'ophthalmic',
    }"></span>
  </p>
  <p class="col-5 min-w-min">
    {{ modelValue.namePsychonautWikiOrg }}
  </p>
  <p class="col">
    {{ modelValue.dose }}&nbsp;{{ modelValue.doseUnit }}
  </p>
  <p class="col" title="sure / quality">
    {{ modelValue.surePercent }}%
  </p>
</template>

<script lang="ts">
import type { ReportSubstanceAlpha1 } from '../services/api';
import { defineComponent, type PropType } from 'vue';
import type { TimeFormat } from './InputMaskTime.vue';
import ReportTime from './ReportTime.vue';

export type T = Partial<ReportSubstanceAlpha1> & Pick<ReportSubstanceAlpha1, 'timeSecond' | 'namePsychonautWikiOrg'>;

export default defineComponent({
  name: 'SubstanceItemView',
  components: { ReportTime },
  props: {
    modelValue: {
      type: Object as PropType<T>,
      required: true,
    },
    timeFormat: {
      default: function () {
        return 'long' as TimeFormat;
      },
    }
  },
  computed: {
    roaSymbol() {
      return {
        '': '•',
        oral: '🍽️',
        sublingual: '👅',
        insufflated: '👃',
        intravenous: '💉',
        smoked: '🚬',
        rectal: '⤴️🍑',
        transdermal: '💉👆',
        intramuscular: '💪💉',
        ophthalmic: '👁💧',
      }[this.modelValue.routeOfAdministration || ''];
    }
  },
});
</script>

<style scoped lang="scss">
.substance {
  padding-top: 1.5em;
  margin-top: 0.5em;
  .formgrid {
    margin: 0.5em 0;
  }
  border-bottom: solid 1px var(--bluegray-100);
  .field {
    padding-top: 1em;
    min-width: 12rem;
  }
}
</style>
