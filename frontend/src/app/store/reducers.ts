import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { ApiToken } from 'src/app/model/api/api-token';
import { addUserToCache, cacheUsers, login, logout, setBackendUrl, setLanguage, toggleSidebar, toggleTheme, unsetBackendUrl } from 'src/app/store/actions';
import { Settings, State, UserCache } from 'src/app/store/state';

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
    on(logout, (_) => undefined)
  ),
  userCache: createReducer<UserCache>(
    { users: [], timestamp: undefined },
    on(cacheUsers, (state, { users }) => ({ users, timestamp: Date.now() })),
    on(addUserToCache, (state, { user }) => ({ users: [user, ...state.users], timestamp: Date.now() }))
  ),
};

/**
 * Meta-reducers.
 * Configured to store the state in the localStorage, excluding fields names 'cache'.
 */
export const metaReducers: MetaReducer<State>[] = [
  localStorageSync({
    keys: Object.keys(reducers),
    rehydrate: true,
    removeOnUndefined: true,
  }),
];
