import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserDTO } from 'src/app/model/api/user-dto';
import { User } from 'src/app/model/domain/user';

@Component({
  selector: 'finwa-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input()
  public user?: User;

  @Input()
  public submitText = 'actions.confirm';

  @Output()
  public readonly userSubmitted = new EventEmitter<UserDTO>();

  public readonly formGroup: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(10)]],
  });

  public constructor(private readonly formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    if (this.user != null) {
      this.formGroup.controls.name.setValue(this.user.name);
    }
  }

  public submit(): void {
    this.userSubmitted.emit({
      id: this.user?.id,
      name: this.formGroup.controls.name.value,
      password: this.formGroup.controls.password.value,
    });
  }
}
