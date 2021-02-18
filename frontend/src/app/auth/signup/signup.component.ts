import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsernameValidator } from './username.validator';
import { EmailValidator } from './email.validator';
import { Router } from '@angular/router';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  private isAuthenticated = false;
  isLoading = false;
  form: FormGroup;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private emailValidator: EmailValidator,
    private usernameValidator: UsernameValidator
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isAuthenticated = this.authService.getIsAuth();
    if (this.isAuthenticated) {
      this.router.navigate(['/']);
    }
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      username: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [
          this.usernameValidator.checkUsername.bind(this.usernameValidator),
        ],
      }),
      email: new FormControl(null, {
        validators: [Validators.email, Validators.required],
        asyncValidators: [
          this.emailValidator.checkEmail.bind(this.emailValidator),
        ],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
    this.isLoading = false;
  }
  checkForm(): boolean {
    if (
      this.form.get('email').valid &&
      this.form.get('username').valid &&
      this.form.get('name').valid &&
      this.form.get('password').valid
    ) {
      return true;
    } else {
      return false;
    }
  }
  async onSignup() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const authData = {
      name: this.form.value.name,
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
    };
    await this.authService.createUser(authData);
    this.form.reset();
    this.isLoading = false;
  }
}
