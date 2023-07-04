type StringArray = string[]

interface SubstanceClass {
  chemical: StringArray
  psychoactive: StringArray
}

interface SubstanceTolerance {
  full: string
  half: string
  zero: string
}

interface RoaRange {
  min: number
  max: number
}

type SubstanceRoaRange = RoaRange

interface SubstanceRoaDurationRange extends RoaRange {
  units: string
}

interface SubstanceRoaDose {
  units: string
  threshold: number
  heavy: number
  common: SubstanceRoaRange
  light: SubstanceRoaRange
  strong: SubstanceRoaRange
}

interface SubstanceRoaDuration {
  afterglow: SubstanceRoaDurationRange
  comeup: SubstanceRoaDurationRange
  duration: SubstanceRoaDurationRange
  offset: SubstanceRoaDurationRange
  onset: SubstanceRoaDurationRange
  peak: SubstanceRoaDurationRange
  total: SubstanceRoaDurationRange
}

export interface SubstanceRoa {
  name: string
  dose: SubstanceRoaDose
  duration: SubstanceRoaDuration
  bioavailability: SubstanceRoaRange
}

export interface SubstanceRoaTypes {
  oral: SubstanceRoa
  sublingual: SubstanceRoa
  buccal: SubstanceRoa
  insufflated: SubstanceRoa
  rectal: SubstanceRoa
  transdermal: SubstanceRoa
  subcutaneous: SubstanceRoa
  intramuscular: SubstanceRoa
  intravenous: SubstanceRoa
  smoked: SubstanceRoa
}

interface SubstanceImage {
  thumb: string
  image: string
}

export interface Effect {
  name: string
  url: string
  substances: Substance[]
  experiences: Experience[]
}

interface Experience {
  substances: Substance[]
  effects: Experience[]
}

export interface Substance {
  name: string
  url: string
  featured: boolean
  effects: Effect[]
  experiences: Experience[]
  class: SubstanceClass
  tolerance: SubstanceTolerance
  roa: SubstanceRoaTypes
  roas: SubstanceRoa[]
  summary: string
  images: SubstanceImage[]
  addictionPotential: string
  toxicity: StringArray
  crossTolerances: StringArray
  commonNames: StringArray
  uncertainInteractions: Substance[]
  unsafeInteractions: Substance[]
  dangerousInteractions: Substance[]
}

export interface Query {
  substances(
    effect: string,
    query: string,
    chemicalClass: string,
    psychoactiveClass: string,
    limit: number,
    offset: number,
  ): Substance[]
  substances_by_effect(effect: StringArray, limit: number, offset: number): Substance[]
  effects_by_substance(substance: string, limit: number, offset: number): Effect[]
  experiences(
    substances_by_effect: string,
    effects_by_substance: string,
    substance: string,
  ): Experience[]
}
