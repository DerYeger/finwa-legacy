import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreationDialog } from './user-creation.dialog';
import { MaterialModule } from '../../material/material.module';
import { MatDialogRef } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

describe('UserCreationDialog', () => {
  let component: UserCreationDialog;
  let fixture: ComponentFixture<UserCreationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserCreationDialog, UserFormComponent],
      imports: [MaterialModule, MaterialModule, StoreModule.forRoot(reducers, undefined), HttpClientTestingModule, FormsModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
