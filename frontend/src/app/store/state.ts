/**
 * The state of this app.
 */
export interface State {
  settings: Settings;
  backendConfig: BackendConfig;
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
  language?: Language;
  sidebar: boolean;
  theme: Theme;
}

export interface BackendConfig {
  url: string | undefined;
  port: number;
  jwt: string | undefined;
}
