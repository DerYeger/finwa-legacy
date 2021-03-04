import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { BackendService } from 'src/app/services/backend.service';
import { logout, setLanguage, toggleSidebar, toggleTheme } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

interface NamedRoute {
  name: string;
  path: string;
}

@Component({
  selector: 'finwa-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnDestroy, OnInit {
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

  private readonly tokenSubscription = this.store
    .select('apiToken')
    .pipe(filter((apiToken) => apiToken === undefined))
    .subscribe(() => {
      this.dialog.closeAll();
      this.router.navigateByUrl('/setup');
    });

  public constructor(private readonly backendService: BackendService, private readonly dialog: MatDialog, private readonly router: Router, private readonly store: Store<State>) {}

  public ngOnInit(): void {
    this.backendService.fetchUsers();
  }

  public ngOnDestroy(): void {
    this.tokenSubscription.unsubscribe();
  }

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
