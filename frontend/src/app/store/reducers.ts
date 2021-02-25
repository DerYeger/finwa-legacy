import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { login, logout, setBackendUrl, setLanguage, toggleSidebar, toggleTheme, unsetBackendUrl } from './actions';
import { Settings, State } from './state';
import { ApiToken } from '../model/api/api-token';

/**
 * Reducers for the app-state.
 */
export const reducers: ActionReducerMap<State> = {
  settings: createReducer<Settings>(
    { backendUrl: undefined, language: undefined, sidebar: true, theme: 'dark-theme' },
    on(setBackendUrl, (state, { backendUrl }) => ({ ...state, backendUrl })),
    on(unsetBackendUrl, (state) => ({ ...state, backendUrl: undefined })),
    on(setLanguage, (state, { language }) => ({ ...state, language })),
    on(toggleSidebar, (state) => ({ ...state, sidebar: !state.sidebar })),
    on(toggleTheme, (state) => ({ ...state, theme: state.theme === 'dark-theme' ? 'light-theme' : 'dark-theme' }))
  ),
  apiToken: createReducer<ApiToken | undefined>(
    undefined,
    on(login, (state, { apiToken }) => apiToken),
    on(logout, () => undefined)
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
