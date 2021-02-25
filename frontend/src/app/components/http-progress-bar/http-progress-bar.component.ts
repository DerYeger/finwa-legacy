import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { catchError, map } from 'rxjs/operators';
import { HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import { SnackBarService } from '../../services/snack-bar.service';

type State = 'sending' | 'querying' | 'fetching';

@Component({
  selector: 'finwa-http-progress-bar[requests]',
  templateUrl: './http-progress-bar.component.html',
  styleUrls: ['./http-progress-bar.component.scss'],
})
export class HttpProgressBarComponent<T> implements OnInit, OnDestroy {
  @Input()
  public requests!: Observable<Observable<HttpEvent<T>>>;

  @Input()
  public displayErrors = true;

  @Output()
  public readonly responseReceived = new EventEmitter<T | null>();

  @Output()
  public readonly errorOccurred = new EventEmitter<void>();

  public readonly progress$ = new EventEmitter<number>();

  public readonly state$ = new EventEmitter<State>();

  public readonly visible$ = new EventEmitter<boolean>();

  public readonly progressMode$: Observable<ProgressBarMode> = this.state$.pipe(
    map((state) => {
      switch (state) {
        case 'sending':
          return 'buffer';
        case 'querying':
          return 'query';
        default:
          return 'determinate';
      }
    })
  );

  private requestsSubscription?: Subscription;
  private requestSubscription?: Subscription;

  public constructor(private readonly snackBarService: SnackBarService) {}

  public ngOnInit(): void {
    this.requestsSubscription = this.requests.subscribe((request) => {
      this.requestSubscription?.unsubscribe();
      this.state$.emit('sending');
      this.progress$.emit(0);
      this.visible$.emit(true);
      this.requestSubscription = request.pipe(catchError((error) => this.onError(error))).subscribe((event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            this.onSent();
            break;
          case HttpEventType.ResponseHeader:
            this.onHeaderReceived();
            break;
          case HttpEventType.DownloadProgress:
            this.onProgress(event);
            break;
          case HttpEventType.Response:
            this.onResponse(event);
        }
      });
    });
  }

  public ngOnDestroy(): void {
    this.requestsSubscription?.unsubscribe();
  }

  private onSent(): void {
    this.state$.emit('querying');
  }

  private onHeaderReceived(): void {
    this.state$.emit('fetching');
  }

  private onProgress(progress: HttpProgressEvent): void {
    const current = progress.loaded;
    // Use maximum safe integer as fallback, if no Content-Length Header is present.
    const total = progress.total ?? Number.MAX_SAFE_INTEGER;
    this.progress$.emit((100 * current) / total);
  }

  private onResponse(response: HttpResponse<T>): void {
    this.visible$.emit(false);
    this.responseReceived.emit(response.body);
  }

  private onError(error: any): Observable<HttpEvent<T>> {
    this.visible$.emit(false);
    this.errorOccurred.emit();
    if (!this.displayErrors) {
      return of();
    }
    const message = error?.error?.message ?? 'api.error.unknown';
    if (typeof message === 'string') {
      this.snackBarService.openSnackBar({ key: message }, undefined, 10000);
    } else {
      // Message is TranslationDTO.
      this.snackBarService.openSnackBar(error?.error?.message, undefined, 10000);
    }
    return of();
  }
}
