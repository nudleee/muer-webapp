import { Component, Input } from '@angular/core';
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
