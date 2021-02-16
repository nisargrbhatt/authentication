import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  private isAuthenticated = false;
  form: FormGroup;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isAuthenticated = this.authService.getIsAuth();
    if (this.isAuthenticated) {
      this.router.navigate(['/']);
    }
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
  }
  async onLogin() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const authData = {
      email: this.form.value.email,
      password: this.form.value.password,
    };
    await this.authService.login(authData);
    this.form.reset();
    this.isLoading = false;
  }
  showPasswordChange() {
    this.showPassword = !this.showPassword;
  }
}
