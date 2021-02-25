import { Component, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '../../store/state';
import { Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { HttpEvent } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { setBackendUrl } from '../../store/actions';
import { HeartbeatResponse } from '../../model/api/heartbeat-response';

const ipAddressRegex = '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$';
const hostnameRegex = '^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$';
const hostRegex = `${ipAddressRegex}|${hostnameRegex}`;

const hostValidator = Validators.pattern(hostRegex);

function portValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value < 1 || 65535 < value) {
    return { portRange: true };
  }
  return null;
}

@Component({
  selector: 'finwa-backend-config',
  templateUrl: './backend-config.component.html',
  styleUrls: ['./backend-config.component.scss'],
})
export class BackendConfigComponent {
  public readonly protocolOptions = ['https', 'http'];

  public readonly requests$ = new EventEmitter<Observable<HttpEvent<HeartbeatResponse>>>();

  public readonly formGroup: FormGroup = this.formBuilder.group({
    protocol: ['https', Validators.required],
    host: ['', [Validators.required, hostValidator]],
    port: ['8080', [Validators.required, portValidator]],
  });

  public constructor(
    private readonly store: Store<State>,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly backendService: BackendService,
    private readonly snackBarService: SnackBarService
  ) {}

  public testBackendConfiguration(): void {
    const protocol = this.formGroup.controls.protocol.value;
    const host = this.formGroup.controls.host.value;
    const port = this.formGroup.controls.port.value;
    const url = `${protocol}://${host}:${port}`;
    const request = this.backendService.verifyBackendHeartbeat$(url);
    this.requests$.next(request);
  }

  public onResponseReceived(response: HeartbeatResponse | null): void {
    if (response !== null && response.message === 'FinWa-Backend') {
      this.store.dispatch(setBackendUrl({ backendUrl: response.url }));
    } else {
      this.onErrorOccurred();
    }
  }

  public onErrorOccurred(): void {
    this.snackBarService.openSnackBar({ key: 'setup.error.test-failed' });
  }
}
