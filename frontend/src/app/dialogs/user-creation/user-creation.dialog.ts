import { Component } from '@angular/core';
import { UserDTO } from '../../model/api/user-dto';
import { BackendService } from '../../services/backend.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'finwa-user-creation',
  templateUrl: './user-creation.dialog.html',
  styleUrls: ['./user-creation.dialog.scss'],
})
export class UserCreationDialog {
  public constructor(private readonly dialogRef: MatDialogRef<UserCreationDialog>, private readonly backendService: BackendService) {}

  public onSubmitted(user: UserDTO): void {
    this.backendService.createUser(user).subscribe(() => this.dialogRef.close());
  }
}
