import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpProgressBarComponent } from './http-progress-bar.component';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { of } from 'rxjs';

describe('HttpProgressBarComponent', () => {
  let component: HttpProgressBarComponent<unknown>;
  let fixture: ComponentFixture<HttpProgressBarComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HttpProgressBarComponent],
      imports: [LoggerTestingModule, MaterialModule, StoreModule.forRoot(reducers, undefined), TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpProgressBarComponent);
    component = fixture.componentInstance;
    component.requests = of();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
