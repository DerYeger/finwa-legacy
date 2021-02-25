import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../store/state';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { HeartbeatResponse } from '../model/api/heartbeat-response';
import { ApiToken } from '../model/api/api-token';
import { Credentials } from '../model/api/credentials';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  public readonly backendUrl$: Observable<string | undefined> = this.store.select('backendConfig').pipe(
    map((backendConfig) => backendConfig.url),
    distinctUntilChanged()
  );

  public constructor(private readonly store: Store<State>, private readonly http: HttpClient) {}

  public isAuthenticated$(): Observable<boolean> {
    return this.store.select('backendConfig').pipe(
      map((backendConfig) => backendConfig.apiToken !== undefined),
      distinctUntilChanged()
    );
  }

  public verifyBackendHeartbeat$(url: string): Observable<HttpEvent<HeartbeatResponse>> {
    return this.http.post<HeartbeatResponse>(
      `${url}/heartbeat`,
      { url },
      {
        reportProgress: true,
        observe: 'events',
      }
    ) as Observable<HttpEvent<HeartbeatResponse>>;
  }

  public login(credentials: Credentials): Observable<HttpEvent<ApiToken>> {
    return this.backendUrl$.pipe(
      filter((url) => url !== undefined),
      mergeMap(
        (url) =>
          this.http.post<ApiToken>(`${url}/auth/login`, credentials, {
            reportProgress: true,
            observe: 'events',
          }) as Observable<HttpEvent<ApiToken>>
      )
    );
  }
}
