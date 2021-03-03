import { HttpEvent } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ApiToken } from 'src/app/model/api/api-token';
import { Credentials } from 'src/app/model/api/credentials';
import { BackendService } from 'src/app/services/backend.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { login, unsetBackendUrl } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

@Component({
  selector: 'finwa-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public readonly requests$ = new EventEmitter<Observable<HttpEvent<ApiToken>>>();

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

  public login(): void {
    const credentials: Credentials = {
      username: this.formGroup.controls.username.value,
      password: this.formGroup.controls.password.value,
    };
    const request = this.backendService.login(credentials);
    this.requests$.emit(request);
  }

  public changeServer(): void {
    this.store.dispatch(unsetBackendUrl());
  }

  public onLoginSuccess(apiToken: ApiToken | null): void {
    if (apiToken === null) {
      this.snackBarService.openSnackBar({ key: 'api.error.unknown' });
    } else {
      this.store.dispatch(login({ apiToken }));
    }
  }
}
