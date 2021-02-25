import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPage } from './setup.page';
import { reducers } from '../../store/reducers';
import { StoreModule } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { HttpProgressBarComponent } from '../../components/http-progress-bar/http-progress-bar.component';

describe('SetupPage', () => {
  let component: SetupPage;
  let fixture: ComponentFixture<SetupPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetupPage, HttpProgressBarComponent],
      imports: [
        MaterialModule,
        StoreModule.forRoot(reducers, undefined),
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        LoggerTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
