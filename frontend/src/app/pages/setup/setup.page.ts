import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'finwa-setup',
  templateUrl: './setup.page.html',
  styleUrls: ['./setup.page.scss'],
})
export class SetupPage {
  public readonly backendConfigured$ = this.backendService.backendUrl$.pipe(map((url) => url !== undefined));

  public constructor(private readonly backendService: BackendService) {}
}
