import { Injectable } from '@angular/core';
import { State } from '../store/state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public constructor(private readonly store: Store<State>) {}

  public isAuthenticated$(): Observable<boolean> {
    return this.store.select('backendConfig').pipe(map((backendConfig) => backendConfig.jwt !== undefined));
  }
}
