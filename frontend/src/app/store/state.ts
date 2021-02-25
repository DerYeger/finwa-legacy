/**
 * The state of this app.
 */
import { ApiToken } from '../model/api/api-token';

export interface State {
  settings: Settings;
  apiToken?: ApiToken;
}

/**
 * Type of available languages.
 */
export type Language = 'en' | 'de';

/**
 * Type of available themes.
 */
export type Theme = 'dark-theme' | 'light-theme';

/**
 * The settings of this app.
 */
export interface Settings {
  backendUrl?: string;
  language?: Language;
  sidebar: boolean;
  theme: Theme;
}
