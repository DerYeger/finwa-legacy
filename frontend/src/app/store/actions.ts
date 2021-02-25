import { createAction, props } from '@ngrx/store';
import { Language } from './state';
import { ApiToken } from '../model/api/api-token'; // Settings

// Settings

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

export const setBackendUrl = createAction('[backendConfig.url] set', props<{ url: string }>());

export const unsetBackendUrl = createAction('[backendConfig.url] unset');

export const setApiToken = createAction('[backendConfig.apiToken] set', props<{ apiToken: ApiToken }>());

export const logout = createAction('[backendConfig] logout');
