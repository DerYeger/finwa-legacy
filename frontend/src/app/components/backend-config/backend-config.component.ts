import { HttpEvent } from '@angular/common/http';
import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HeartbeatResponse } from 'src/app/model/api/heartbeat-response';
import { BackendService } from 'src/app/services/backend.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { setBackendUrl } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

const hostRegex = '^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$';
const addressValidator = Validators.pattern(hostRegex);

@Component({
  selector: 'finwa-backend-config',
  templateUrl: './backend-config.component.html',
  styleUrls: ['./backend-config.component.scss'],
})
export class BackendConfigComponent {
  public readonly requests$ = new EventEmitter<Observable<HttpEvent<HeartbeatResponse>>>();

  public readonly formGroup: FormGroup = this.formBuilder.group({
    protocol: ['https', Validators.required],
    address: ['', [Validators.required, addressValidator]],
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
    const address = this.formGroup.controls.address.value;
    const url = `${protocol}://${address}`;
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
