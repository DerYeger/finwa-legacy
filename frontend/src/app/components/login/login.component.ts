import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '../../store/state';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { unsetBackendUrl } from '../../store/actions';

@Component({
  selector: 'finwa-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public readonly formGroup: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  public constructor(
    private readonly store: Store<State>,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly backendService: BackendService,
    private readonly snackBarService: SnackBarService
  ) {}

  public login(): void {}

  public changeServer(): void {
    this.store.dispatch(unsetBackendUrl());
  }
}
