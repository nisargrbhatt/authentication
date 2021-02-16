import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/user/';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private userData: { last_login: Date; profile_setup: boolean };
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }
  getUserId() {
    return this.userId;
  }
  getUserData() {
    return this.userData;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getNewUserData() {
    this.http
      .get<{
        message: string;
        success: boolean;
        data: { last_login: Date; profile_setup: boolean };
        error: string;
      }>(BACKEND_URL + 'getuserdata')
      .subscribe(
        (response) => {
          this.userData = response.data;
          localStorage.removeItem('userData');
          localStorage.setItem('userData', JSON.stringify(this.userData));
        },
        (error) => {
          console.log(error);
        }
      );
  }
  checkEmail(email: string) {
    return this.http.get<{ ok: boolean }>(BACKEND_URL + 'checkemail/' + email);
  }
  checkUsername(username: string) {
    return this.http.get<{ ok: boolean }>(
      BACKEND_URL + 'checkusername/' + username
    );
  }
  createUser(authData) {
    this.http
      .post<{
        message: string;
        success: boolean;
        data: any;
        error: string;
      }>(BACKEND_URL + 'createuser', authData)
      .subscribe(
        (response) => {
          console.log(response.message);
          console.log(response.data);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  login(authData) {
    this.http
      .post<{
        message: string;
        success: boolean;
        data: {
          token: string;
          expiresIn: number;
          userId: string;
          last_login: Date;
          profile_setup: boolean;
        };
        error: string;
      }>(BACKEND_URL + 'userlogin', authData)
      .subscribe(
        (response) => {
          const token = response.data.token;
          this.token = token;
          this.userData = {
            last_login: response.data.last_login,
            profile_setup: response.data.profile_setup,
          };
          if (token) {
            const expiresInDuration = response.data.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.data.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(
              token,
              expirationDate,
              this.userId,
              this.userData
            );
            if (!response.data.profile_setup) {
              this.router.navigate(['/profile/create']);
            } else {
              this.router.navigate(['/']);
            }
          }
        },
        (error) => {
          console.log(error);
          this.authStatusListener.next(false);
        }
      );
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    userData: { last_login: Date; profile_setup: boolean }
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userData = localStorage.getItem('userData');
    if (!token || !expirationDate || !userId || !userData) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userData: JSON.parse(userData),
    };
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.userData = authInformation.userData;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    this.userData = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
  }
}
