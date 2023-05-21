declare module '*.ftl' {
  import type { FluentResource } from '@fluent/bundle'
  const rsrs: FluentResource
  const data: unknown
  export { data, rsrs }
  export default { data, rsrs }
}
