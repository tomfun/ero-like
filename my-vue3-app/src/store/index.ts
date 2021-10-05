// import { createStore } from 'vuex';

// export default createStore({
//   state: {
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//   },
// });

import Vuex from 'vuex';

import employees, { REPORTS_MODULE } from './reports';

export default new Vuex.Store({
  modules: {
    [REPORTS_MODULE]: employees,
  },
});
