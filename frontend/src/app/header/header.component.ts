import { AuthService } from './../auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authStatusSub: Subscription;
  menuVar = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
      });
  }
  onLogout() {
    this.authService.logout();
  }
  openMenu() {
    this.menuVar = true;
  }
  closeMenu() {
    this.menuVar = false;
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
