import { ProfilePasswordComponent } from './../dialogs/profile-password/profile-password.component';
import { ProfilePhotoComponent } from './../dialogs/profile-photo/profile-photo.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileModel } from './../profile.model';
import { Router } from '@angular/router';
import { ProfileService } from './../profile.service';
import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-show',
  templateUrl: './profile-show.component.html',
  styleUrls: ['./profile-show.component.scss'],
})
export class ProfileShowComponent implements OnInit {
  isLoading = false;
  profile: ProfileModel;

  private isAuthenticated = false;
  private userId: string;

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.isAuthenticated = this.authService.getIsAuth();
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
    }
    this.userId = this.authService.getUserId();
    this.profileService.getUserProfile().subscribe(
      (response) => {
        console.log(response.message);
        console.log(response.success);
        console.log(response.data);
        this.profile = response.data;

        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }
  photoChange() {
    const dialogRef = this.dialog.open(ProfilePhotoComponent, {
      data: { image: this.profile.photo, name: this.profile.name },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }
  passwordChange() {
    const dialogRef = this.dialog.open(ProfilePasswordComponent, {
      data: { name: this.profile.name },
    });
    dialogRef.afterClosed().subscribe((result) => this.ngOnInit());
  }
}
