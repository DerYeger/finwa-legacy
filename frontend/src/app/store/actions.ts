import { createAction, props } from '@ngrx/store';
import { Language } from './state'; // Settings

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

export const setUrl = createAction('[backendConfig.url] set', props<{ url: string }>());

export const setPort = createAction('[backendConfig.port] set', props<{ port: number }>());

export const setJWT = createAction('[backendConfig.jwt] set', props<{ jwt: string }>());

export const logout = createAction('[backendConfig] logout');
