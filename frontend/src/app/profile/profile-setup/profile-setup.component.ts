import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileService } from './../profile.service';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-setup',
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.scss'],
})
export class ProfileSetupComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  private isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isAuthenticated = this.authService.getIsAuth();
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
    }
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      gender: new FormControl(null, {
        validators: [Validators.required],
      }),
      contact_no: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      }),
      address: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
  }
  async onSetProfile() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const profileData = {
      name: this.form.value.name,
      gender: this.form.value.gender,
      contact_no: this.form.value.contact_no,
      address: this.form.value.address,
    };
    await this.profileService.setProfile(profileData);
  }
}
