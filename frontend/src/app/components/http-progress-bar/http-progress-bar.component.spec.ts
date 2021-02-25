import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpProgressBarComponent } from './http-progress-bar.component';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('HttpProgressBarComponent', () => {
  let component: HttpProgressBarComponent;
  let fixture: ComponentFixture<HttpProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HttpProgressBarComponent],
      imports: [MaterialModule, TranslateModule.forRoot(), StoreModule.forRoot(reducers, undefined), LoggerTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
