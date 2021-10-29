export const IS_LOADING = 'isLoading';

export interface IsLoading {
    isLoading: boolean;
}

export interface State {
    [IS_LOADING]: IsLoading;
}

export default {
    [IS_LOADING]: {
        isLoading: false,
    },
} as State;