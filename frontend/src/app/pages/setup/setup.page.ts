import { Component, OnDestroy, OnInit } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { State } from '../../store/state';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'finwa-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage implements OnInit, OnDestroy {
  public readonly backendConfigured$ = this.backendService.backendUrl$.pipe(map((url) => url !== undefined));

  private tokenSubscription?: Subscription;

  public constructor(private readonly backendService: BackendService, private readonly store: Store<State>, private readonly router: Router) {}

  public ngOnInit(): void {
    this.tokenSubscription = this.store
      .select('apiToken')
      .pipe(
        distinctUntilChanged(),
        filter((apiToken) => apiToken !== undefined)
      )
      .subscribe(() => this.router.navigateByUrl('/'));
  }

  public ngOnDestroy(): void {
    this.tokenSubscription?.unsubscribe();
  }
}
