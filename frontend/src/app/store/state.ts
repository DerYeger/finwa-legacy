/**
 * The state of this app.
 */
import { ApiToken } from '../model/api/api-token';
import { User } from '../model/domain/user';

export interface State {
  settings: Settings;
  apiToken?: ApiToken;
  userCache: UserCache;
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

export interface UserCache {
  users: User[];
  timestamp: number | undefined;
}
