import { Component, Input, OnInit } from '@angular/core';
import { AccountInfo } from '@azure/msal-browser';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private authService: AuthServiceService) {}

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
