import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
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
    this.profileService.getUserProfile().subscribe(
      (response) => {
        console.log(response.message);
        console.log(response.success);
        this.form.setValue({
          name: response.data.name,
          gender: response.data.gender,
          contact_no: response.data.contact_no,
          address: response.data.address,
        });
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.router.navigate(['/']);
        this.isLoading = false;
      }
    );
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
