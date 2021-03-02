import { createAction, props } from '@ngrx/store';
import { Language } from './state';
import { ApiToken } from '../model/api/api-token';
import { User } from '../model/domain/user'; // Settings

// Settings

export const setBackendUrl = createAction('[settings.backendUrl] set', props<{ backendUrl: string | undefined }>());

export const unsetBackendUrl = createAction('[settings.backendUrl] unset');

/**
 * Sets the language to the given value.
 */
export const setLanguage = createAction('[settings.language] set', props<{ language: Language }>());

/**
 * Toggles the state of the sidebar between expanded and collapsed.
 */
export const toggleSidebar = createAction('[settings.sidebar] toggle');

/**
 * Toggles the theme between dark- and light-mode.
 */
export const toggleTheme = createAction('[settings.theme] toggle');

// Authentication

export const login = createAction('[apiToken] login', props<{ apiToken: ApiToken }>());

export const logout = createAction('[apiToken] logout');

// UserCache

export const cacheUsers = createAction('[userCache] cache', props<{ users: User[] }>());

export const addUserToCache = createAction('[userCache] add', props<{ user: User }>());
