import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UserDTO } from 'src/app/model/api/user-dto';
import { User } from 'src/app/model/domain/user';
import { BackendService } from 'src/app/services/backend.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'finwa-user-edit',
  templateUrl: './user-edit.dialog.html',
  styleUrls: ['./user-edit.dialog.scss'],
})
export class UserEditDialog {
  public constructor(
    private readonly backendService: BackendService,
    private readonly dialogRef: MatDialogRef<UserEditDialog>,
    private readonly snackBarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public readonly user: User
  ) {}

  public onSubmitted(user: UserDTO): void {
    this.backendService.editUser(user).subscribe(() => this.dialogRef.close());
  }
}
