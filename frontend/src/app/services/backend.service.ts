import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, OperatorFunction } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';

import { ApiToken } from 'src/app/model/api/api-token';
import { Credentials } from 'src/app/model/api/credentials';
import { HeartbeatResponse } from 'src/app/model/api/heartbeat-response';
import { UserDTO } from 'src/app/model/api/user-dto';
import { User } from 'src/app/model/domain/user';
import { addUserToCache, cacheUsers } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  public readonly backendUrl$: Observable<string | undefined> = this.store.select('settings').pipe(
    map((settings) => settings.backendUrl),
    distinctUntilChanged()
  );

  public constructor(private readonly store: Store<State>, private readonly http: HttpClient) {}

  public isAuthenticated$(): Observable<boolean> {
    return this.store.select('apiToken').pipe(
      map((apiToken) => apiToken !== undefined),
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
    return this.withBackendUrl(
      (url) =>
        this.http.post<ApiToken>(`${url}/auth/login`, credentials, {
          reportProgress: true,
          observe: 'events',
        }) as Observable<HttpEvent<ApiToken>>
    );
  }

  public createUser(user: UserDTO): Observable<User> {
    return this.withBackendUrl((url) => this.http.post<User>(`${url}/api/users`, user)).pipe(tap((createdUser) => this.store.dispatch(addUserToCache({ user: createdUser }))));
  }

  public editUser(user: UserDTO): Observable<void> {
    return this.withBackendUrl((url) => this.http.put<void>(`${url}/api/users`, user)).pipe(tap(() => this.fetchUsers()));
  }

  public deleteUserById(id: string): Observable<void> {
    // TODO prevent deletion of logged-in user
    return this.withBackendUrl((url) => this.http.delete<void>(`${url}/api/users/${id}`)).pipe(tap(() => this.fetchUsers()));
  }

  public fetchUsers(): void {
    this.withBackendUrl((url) => this.http.get<User[]>(`${url}/api/users`)).subscribe((users) => this.store.dispatch(cacheUsers({ users })));
  }

  private withBackendUrl<T>(request: (url: string) => Observable<T>): Observable<T> {
    return this.backendUrl$.pipe(
      filter((url) => url !== undefined) as OperatorFunction<string | undefined, string>,
      mergeMap((url: string) => request(url))
    );
  }
}
