import { AuthService } from './../auth/auth.service';
import { ProfileModel } from './profile.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  setPhoto(photoData) {
    this.http
      .put<{
        message: string;
        success: boolean;
        data: any;
        error: string;
      }>(BACKEND_URL + 'setphoto', photoData)
      .subscribe(
        (response) => {
          console.log(response.message);
          console.log(response.success);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  setProfile(profileData: {
    name: string;
    gender: string;
    contact_no: number;
    address: string;
  }) {
    this.http
      .put<{
        message: string;
        success: boolean;
        data: any;
        error: string;
      }>(BACKEND_URL + 'setprofile', profileData)
      .subscribe(
        (response) => {
          console.log(response.message);
          console.log(response.success);
          this.authService.getNewUserData();
          this.router.navigate(['/']);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  passwordReset(passwordData: { oldpassword: string; newpassword: string }) {
    this.http
      .put<{ message: string; success: boolean; data: any; error: string }>(
        BACKEND_URL + 'resetpassword',
        passwordData
      )
      .subscribe(
        (response) => {
          console.log(response.message);
          console.log(response.success);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getUserProfile() {
    return this.http.get<{
      message: string;
      success: boolean;
      data: ProfileModel;
      error: string;
    }>(BACKEND_URL + 'getuser');
  }
}
