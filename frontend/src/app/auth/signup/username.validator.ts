import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class UsernameValidator {
  debouncer: any;

  constructor(public authService: AuthService) {}

  checkUsername(control: FormControl): any {
    clearTimeout(this.debouncer);

    return new Promise((resolve) => {
      this.debouncer = setTimeout(() => {
        this.authService.checkUsername(control.value).subscribe(
          (res) => {
            if (res.ok) {
              resolve(null);
            } else {
              resolve({ usernameInUse: true });
            }
          },
          (err) => {
            resolve({ usernameInUse: true });
          }
        );
      }, 10);
    });
  }
}
