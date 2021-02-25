import { Component } from '@angular/core';
import { State } from '../../store/state';
import { Store } from '@ngrx/store';
import { setJWT } from '../../store/actions';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BackendService } from '../../services/backend.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { TranslationDTO } from 'src/app/model/api/translation.dto';

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
  selector: 'finwa-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage {
  public readonly protocolOptions = ['https', 'http'];

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
    this.backendService.verifyBackendHeartbeat$(url).subscribe((result) => {
      if (result) {
        // TODO authenticate
        this.finishSetup();
      } else {
        const message: TranslationDTO = {
          key: 'setup.error.test-failed',
          params: { url },
        };
        this.snackBarService.openSnackBar(message);
      }
    });
  }

  public finishSetup(): void {
    this.store.dispatch(setJWT({ jwt: 'test' }));
    this.router.navigateByUrl('/');
  }
}
