import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDTO } from '../../model/api/user-dto';

@Component({
  selector: 'finwa-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  @Input()
  public submitText = 'actions.confirm';

  @Output()
  public readonly userSubmitted = new EventEmitter<UserDTO>();

  public readonly formGroup: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(10)]],
  });

  public constructor(private readonly formBuilder: FormBuilder) {}

  public submit(): void {
    this.userSubmitted.emit({
      name: this.formGroup.controls.name.value,
      password: this.formGroup.controls.password.value,
    });
  }
}
