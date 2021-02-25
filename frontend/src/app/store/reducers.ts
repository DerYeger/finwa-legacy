import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { logout, unsetBackendUrl, setApiToken, setBackendUrl, setLanguage, toggleSidebar, toggleTheme } from './actions';
import { BackendConfig, Settings, State } from './state';

/**
 * Reducers for the app-state.
 */
export const reducers: ActionReducerMap<State> = {
  settings: createReducer<Settings>(
    { language: undefined, sidebar: true, theme: 'dark-theme' },
    on(setLanguage, (state, { language }) => ({ ...state, language })),
    on(toggleSidebar, (state) => ({ ...state, sidebar: !state.sidebar })),
    on(toggleTheme, (state) => ({ ...state, theme: state.theme === 'dark-theme' ? 'light-theme' : 'dark-theme' }))
  ),
  backendConfig: createReducer<BackendConfig>(
    { url: undefined, apiToken: undefined },
    on(setBackendUrl, (state, { url }) => ({ ...state, url })),
    on(unsetBackendUrl, (state) => ({ ...state, url: undefined })),
    on(setApiToken, (state, { apiToken }) => ({ ...state, apiToken })),
    on(logout, (state) => ({ ...state, apiToken: undefined }))
  ),
};

/**
 * Meta-reducers.
 * Configured to store the state in the localStorage, excluding fields names 'cache'.
 */
export const metaReducers: MetaReducer<State>[] = [
  localStorageSync({
    keys: Object.keys(reducers).filter((key) => !key.toLowerCase().includes('cache')),
    rehydrate: true,
    removeOnUndefined: true,
  }),
];
