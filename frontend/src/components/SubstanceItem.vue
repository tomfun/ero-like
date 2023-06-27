<template>
  <div class="substance border-bluegray-100">
  <div class="formgrid grid" v-if="isEdit">
    <div class="field col-12 md:col-8">
      <div class="p-float-label">
        <AutoComplete
          :inputId="id('name-sub')"
          dropdown
          placeholder="Substance, e.g. 'MDMA'"
          optionLabel="name"
          dataKey="name"
          v-model:modelValue="namePsychonautWikiOrg"
          :suggestions="suggestions"
          :disabled="!loaded"
          @complete="onComplete('namePsychonautWikiOrg', $event)"
          class="w-full"
        >
          <template #option="{option}">
            <div>
              {{ option.name }}
              <small>{{ (option.commonNames || []).join(', ') }}</small>
            </div>
          </template>
        </AutoComplete>
        <label :for="id('name-sub')">Substance name</label>
      </div>
    </div>
    <div class="field col">
      <div class="p-float-label">
        <Dropdown
          class="w-full"
          :inputId="id('route')"
          :options="routeOfAdministrationOptions"
          :modelValue="modelValue.routeOfAdministration"
          @update:modelValue="setSingleValue('routeOfAdministration', $event)"
        />
        <label :for="id('route')">Route of administration</label>
      </div>
    </div>
    <div class="field col-fixed" style="min-width: 8rem">
      <div class="p-float-label">
        <Dropdown
          class="w-full min-w-min"
          :inputId="id('dose-unit')"
          :modelValue="modelValue.doseUnit"
          :options="doseUnitOptions"
          @update:modelValue="setSingleValue('doseUnit', $event)"
        />
        <label :for="id('dose-unit')">Dosage unit</label>
      </div>
    </div>
    <div class="field col-fixed" style="min-width: 8rem">
      <div class="p-float-label">
        <InputNumber
          class="w-8rem"
          :pt="{ input: { style: 'width: 8rem'} }"
          :inputId="id('dose')"
          :modelValue="modelValue.dose"
          :locale="$locale.locale"
          @update:modelValue="setSingleValue('dose', $event)"
          :minFractionDigits="2"
          :min="0"
        />
        <label :for="id('dose')">Amount</label>
      </div>
    </div>
    <div class="field col">
      <div class="p-float-label">
        <Dropdown
          class="w-full"
          :inputId="id('qualityPercent')"
          :modelValue="modelValue.surePercent"
          :options="percentOptions"
          @update:modelValue="setSingleValue('surePercent', $event)"
        />
        <label :for="id('qualityPercent')">Quality percent</label>
      </div>
      <small :id="id('qualityPercent')">
        How much you sure about the quality of the substance?
      </small>
    </div>
    <div class="field col min-w-min">
      <div class="p-float-label p-float-label-shift">
        <InputMaskTime
          :inputId="id('timeSecond')"
          :timeFormat="timeFormat"
          :modelValue="modelValue.timeSecond"
          :allow0="isFirst"
          @update:modelValue="setSingleValue('timeSecond', $event)"
        />
        <label :for="id('timeSecond')">Time of input</label>
      </div>
    </div>
    <div class="w-full">
      <div class="card flex justify-content-center flex-wrap gap-3">
        <Button
          severity="secondary"
          v-on:click="editClick">
          <span class="pi pi-check"></span>
          &nbsp;
          {{ $t('OK') }}
        </Button>
        <Button
          class="bg-transparent text-color-secondary"
          severity="secondary"
          v-tooltip="$t('Remove')"
          v-on:click="rm">
          <span class="pi pi-times"></span>
        </Button>
      </div>
    </div>
  </div>
  <div class="grid" v-else>
    <div class="grid col">
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
      <p class="col">
        {{ modelValue.surePercent }}
      </p>
    </div>
    <div class="col-fixed w-8rem p-buttonset text-right">
      <Button
        severity="secondary"
        size="small"
        outlined
        v-tooltip="$t('Edit')"
        v-on:click="editClick">
        <span class="pi pi-pencil"></span>
      </Button>
      <Button
        severity="secondary"
        size="small"
        outlined
        v-tooltip="$t('Remove')"
        v-on:click="rm">
        <span class="pi pi-times"></span>
      </Button>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import type { Substance, PsychonautWikiSubstance } from '../services/api';
import { defineComponent } from 'vue';
import { fetchPsychonautWikiSubstanceList } from '../services/api';
import ReportTime from './ReportTime.vue';
import InputMaskTime, { type TimeFormat } from './InputMaskTime.vue';

export type T = Partial<Substance> & Pick<Substance, 'timeSecond' | 'namePsychonautWikiOrg'>;

export default defineComponent({
  name: 'SubstanceItem',
  components: { InputMaskTime, ReportTime },
  props: {
    modelValue: {
      default: function () {
        return {
          dose: 1,
        } as T;
      },
    },
    isFirst: {
      default: function () {
        return false as boolean;
      },
    },
    rm: {
      default: function () {
        return (() => null) as (payload: MouseEvent) => void;
      },
    },
    timeFormat: {
      default: function () {
        return 'long' as TimeFormat;
      },
    }
  },
  emits: {
    'update:modelValue'(substance: T) {
      return typeof substance === 'object' && typeof substance.timeSecond === 'number';
    }
  },
  async mounted() {
    this.psychonautWikiSubstanceList = await fetchPsychonautWikiSubstanceList()
    this.loaded = true
  },
  data() {
    const builtInSubstances = ["Heroin", "2C-B", "2C-I", "DOB", "LSA", "LSD", "MDMA"]
      .map((s) => ({ name: s, commonNames: null } as PsychonautWikiSubstance));
    return {
      loaded: false,
      isEdit: true,
      uid: Math.random().toString(27).slice(2),
      suggestions: builtInSubstances,
      psychonautWikiSubstanceList: builtInSubstances,
      doseUnitOptions: ["mg", "µg", "g"],
      routeOfAdministrationOptions: ["oral", "sublingual", "insufflated", "intravenous", "smoked", "rectal", "transdermal", "intramuscular", "ophthalmic"],
      percentOptions: [10, 20, 30, 40, 50, 60, 70, 80, 90, 99],
    };
  },
  computed: {
    namePsychonautWikiOrg: {
      get(): PsychonautWikiSubstance | null {
        return this.psychonautWikiSubstanceList
          .find(({ name }) => name === this.modelValue.namePsychonautWikiOrg)
        || this.modelValue.namePsychonautWikiOrg
          ? { name: this.modelValue.namePsychonautWikiOrg } as PsychonautWikiSubstance
          : null;
      },
      set(value: PsychonautWikiSubstance | string) {
        const namePsychonautWikiOrg = value && (value as PsychonautWikiSubstance).name
          || (value as string);
        this.setNewValue({ namePsychonautWikiOrg });
      }
    },
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
  methods: {
    id(id: string) {
      return this.uid + id.toString();
    },
    setSingleValue(key: keyof Substance, value: Substance[keyof Substance]) {
      this.setNewValue({ [key]: value })
    },
    setNewValue(value: Partial<Substance>) {
      const newValue: T = Object.assign(this.modelValue, value);
      this.$emit('update:modelValue', newValue);
    },
    editClick() {
      this.isEdit = !this.isEdit
    },
    onComplete(
      name: string,
      { query }: { query: string },
    ) {
      const q = query.toLowerCase();
      const suggestions = this.psychonautWikiSubstanceList
        .filter((s) =>
          s.name.toLowerCase().startsWith(q)
          || (s.commonNames || []).some((s) => s.toLowerCase().startsWith(query)))
      this.suggestions = suggestions;
    },
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
    //label {
    //  white-space: nowrap;
    //  //width: calc(100% + 1rem);
    //  //min-width: 6rem;
    //  //min-width: max-content;
    //  overflow: hidden; /* Optional, in case you also want to hide text that overflows the container */
    //  text-overflow: ellipsis; /* Optional, to add an ellipsis (...) when the text overflows */
    //  //position: relative !important;
    //}
  }
}
</style>
