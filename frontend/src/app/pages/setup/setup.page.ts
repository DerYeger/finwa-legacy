import { Component } from '@angular/core';
import { State } from '../../store/state';
import { Store } from '@ngrx/store';
import { setJWT } from '../../store/actions';
import { Router } from '@angular/router';

@Component({
  selector: 'finwa-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage {
  public constructor(private readonly store: Store<State>, private readonly router: Router) {}

  public finishSetup(): void {
    this.store.dispatch(setJWT({ jwt: 'test' }));
    this.router.navigateByUrl('/');
  }
}
