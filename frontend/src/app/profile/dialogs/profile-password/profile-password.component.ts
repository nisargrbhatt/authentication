import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-profile-password',
  templateUrl: './profile-password.component.html',
  styleUrls: ['./profile-password.component.scss'],
})
export class ProfilePasswordComponent implements OnInit {
  form: FormGroup;
  showPassword1 = false;
  showPassword2 = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string },
    public dialogRef: MatDialogRef<ProfilePasswordComponent>,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      oldpassword: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      newpassword: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }
  async onPassword() {
    if (this.form.invalid) {
      return;
    }
    const passwordData = {
      oldpassword: this.form.value.oldpassword,
      newpassword: this.form.value.newpassword,
    };
    await this.profileService.passwordReset(passwordData);
    this.dialogRef.close();
  }
}
