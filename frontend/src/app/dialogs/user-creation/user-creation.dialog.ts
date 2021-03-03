import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { UserDTO } from 'src/app/model/api/user-dto';
import { BackendService } from 'src/app/services/backend.service';

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
