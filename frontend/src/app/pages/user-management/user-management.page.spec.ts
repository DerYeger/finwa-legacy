import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementPage } from './user-management.page';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../material/material.module';
import { UserTableComponent } from '../../components/user-table/user-table.component';
import { TranslateModule } from '@ngx-translate/core';

describe('UserManagementPage', () => {
  let component: UserManagementPage;
  let fixture: ComponentFixture<UserManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserManagementPage, UserTableComponent],
      imports: [HttpClientTestingModule, MaterialModule, StoreModule.forRoot(reducers, undefined), TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
