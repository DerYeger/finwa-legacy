import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { UserTableComponent } from 'src/app/components/user-table/user-table.component';
import { MaterialModule } from 'src/app/material/material.module';
import { UserManagementPage } from 'src/app/pages/user-management/user-management.page';
import { reducers } from 'src/app/store/reducers';

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
