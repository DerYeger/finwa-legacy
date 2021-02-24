import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { logout, setJWT, setLanguage, setPort, setUrl, toggleSidebar, toggleTheme } from './actions';
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
    { url: undefined, port: 8080, jwt: undefined },
    on(setUrl, (state, { url }) => ({ ...state, url })),
    on(setPort, (state, { port }) => ({ ...state, port })),
    on(setJWT, (state, { jwt }) => ({ ...state, jwt })),
    on(logout, (state) => ({ ...state, jwt: undefined }))
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
