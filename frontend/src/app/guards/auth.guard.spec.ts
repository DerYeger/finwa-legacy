import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { BackendService } from '../services/backend.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../store/reducers';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers, undefined), HttpClientTestingModule, RouterTestingModule],
      providers: [BackendService],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
