import { Component } from '@angular/core';
import { BackendService } from '../../services/backend.service';
import { MatDialog } from '@angular/material/dialog';
import { UserCreationDialog } from '../../dialogs/user-creation/user-creation.dialog';

@Component({
  selector: 'finwa-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
})
export class UserManagementPage {
  public constructor(private readonly backendService: BackendService, private readonly dialog: MatDialog) {}

  public refreshUsers(): void {
    this.backendService.fetchUsers();
  }

  public openCreateUserDialog(): void {
    this.dialog.open(UserCreationDialog);
  }
}
