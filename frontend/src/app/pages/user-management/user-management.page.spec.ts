import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementPage } from './user-management.page';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../store/reducers';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserManagementPage', () => {
  let component: UserManagementPage;
  let fixture: ComponentFixture<UserManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserManagementPage],
      imports: [StoreModule.forRoot(reducers, undefined), HttpClientTestingModule],
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
