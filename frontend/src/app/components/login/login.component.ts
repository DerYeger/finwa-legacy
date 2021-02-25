import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '../../store/state';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { login, unsetBackendUrl } from '../../store/actions';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { Credentials } from '../../model/api/credentials';
import { ApiToken } from '../../model/api/api-token';

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
