import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { forkJoin, Observable, of } from 'rxjs';
import { TranslationDTO } from '../model/api/translation.dto';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  public constructor(private readonly snackBar: MatSnackBar, private readonly translate: TranslateService, private readonly log: NGXLogger) {}

  public async openSnackBar(translationDTO: TranslationDTO, actionDTO?: TranslationDTO, duration: number | undefined = 5000): Promise<MatSnackBarRef<TextOnlySnackBar>> {
    const message$: Observable<string> = this.translate.get(translationDTO.key, translationDTO.params);
    const action$: Observable<string | undefined> = actionDTO ? this.translate.get(actionDTO.key, actionDTO.params) : of(undefined);
    const [message, action] = await forkJoin([message$, action$]).toPromise();
    this.log.debug(`Openend SnackBar - Message: ${message} - Action: ${action}`);
    return this.snackBar.open(message, action, { duration });
  }
}
