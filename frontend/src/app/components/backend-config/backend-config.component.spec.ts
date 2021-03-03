import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackendConfigComponent } from './backend-config.component';
import { MaterialModule } from '../../material/material.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { HttpProgressBarComponent } from '../http-progress-bar/http-progress-bar.component';

describe('BackendConfigComponent', () => {
  let component: BackendConfigComponent;
  let fixture: ComponentFixture<BackendConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BackendConfigComponent, HttpProgressBarComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterTestingModule,
        StoreModule.forRoot(reducers, undefined),
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
