import { TestBed } from '@angular/core/testing';
import { BackendService } from './backend.service';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../store/reducers';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BackendService', () => {
  let service: BackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(reducers, undefined), HttpClientTestingModule],
    });
    service = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
