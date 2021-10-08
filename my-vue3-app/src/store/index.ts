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

import reports, { REPORTS_MODULE } from './reports';
import { State as ReportsModuleState } from './reports/state';

export interface State {
  [REPORTS_MODULE]: ReportsModuleState;
}

export default new Vuex.Store<State>({
  modules: {
    [REPORTS_MODULE]: reports,
  },
});
