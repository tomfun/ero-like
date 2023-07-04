import { createMetaManager } from 'vue-meta'

export default createMetaManager(false, {
  /*
  "Accepted" Proposals
  dcterms.available - The date the resource became available.
  dcterms.created - The creation date of the resource.
  dcterms.dateAccepted - The date the resource was accepted.
  dcterms.submitted - The date the resource was submitted.
  dcterms.issued - The publication date of a resource.
  https://stackoverflow.com/questions/4575967/is-there-a-standardized-meta-tag-for-the-date-of-a-website

  https://www.dublincore.org/specifications/dublin-core/dc-html/
   */
  'DC.title': { tag: 'meta' },
  'DC.date': { tag: 'meta' },
  'DC.creator': { tag: 'meta' },
  'DCTERMS.creator': { tag: 'meta' },
  'DCTERMS.created': { tag: 'meta' },
  'DCTERMS.dateAccepted': { tag: 'meta' },
  'DCTERMS.submitted': { tag: 'meta' },
  'DCTERMS.date': { tag: 'meta' },
  'DCTERMS.dateSubmitted': { tag: 'meta' },

  body: { tag: 'script', to: 'body' },
  base: { valueAttribute: 'href' },
  charset: { tag: 'meta', nameless: true, valueAttribute: 'charset' },
  description: { tag: 'meta' },
  og: { group: true, namespacedAttribute: true, tag: 'meta', keyAttribute: 'property' },
  twitter: { group: true, namespacedAttribute: true, tag: 'meta' },
  htmlAttrs: { attributesFor: 'html' },
  headAttrs: { attributesFor: 'head' },
  bodyAttrs: { attributesFor: 'body' },
})
