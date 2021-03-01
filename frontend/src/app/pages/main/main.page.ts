import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { logout, setLanguage, toggleSidebar, toggleTheme } from 'src/app/store/actions';
import { State } from '../../store/state';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { distinctUntilChanged, map } from 'rxjs/operators';

interface NamedRoute {
  name: string;
  path: string;
}

@Component({
  selector: 'finwa-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage {
  public readonly availableRoutes: NamedRoute[] = [
    {
      name: 'home.title',
      path: 'home',
    },
    {
      name: 'user-management.title',
      path: 'users',
    },
  ];

  public readonly language$ = this.store.select('settings').pipe(
    map((settings) => settings.language),
    distinctUntilChanged()
  );

  public readonly sidebar$ = this.store.select('settings').pipe(
    map((settings) => settings.sidebar),
    distinctUntilChanged()
  );

  public readonly themeButtonIcon$ = this.store.select('settings').pipe(
    map((settings) => (settings.theme === 'dark-theme' ? 'light_mode' : 'dark_mode')),
    distinctUntilChanged()
  );

  public constructor(private readonly store: Store<State>) {}

  public toggleSidebar(): void {
    this.store.dispatch(toggleSidebar());
  }

  public setLanguage(event: MatButtonToggleChange): void {
    this.store.dispatch(setLanguage({ language: event.value }));
  }

  public logout(): void {
    this.store.dispatch(logout());
  }

  public toggleTheme(): void {
    this.store.dispatch(toggleTheme());
  }
}
