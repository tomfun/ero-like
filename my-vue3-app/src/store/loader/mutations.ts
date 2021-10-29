import { State, IsLoading } from './state';

export const SET_LOADING = 'set_loading';

export default {
  [SET_LOADING](state: State, isLoading: IsLoading) {
    state.isLoading = isLoading;
  },
};
