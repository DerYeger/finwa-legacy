import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'finwa-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
})
export class UserManagementPage {
  public constructor(private readonly backendService: BackendService) {}

  public refreshUsers(): void {
    this.backendService.fetchUsers();
  }
}
