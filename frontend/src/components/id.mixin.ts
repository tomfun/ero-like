export default {
  data() {
    return {
      uid: Math.random().toString(27).slice(2),
    }
  },
  methods: {
    id<C extends { uid: string }>(this: C, id: string) {
      return this.uid + id.toString()
    },
  },
}
