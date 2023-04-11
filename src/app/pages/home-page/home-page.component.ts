import { Component } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor(private authService: AuthServiceService) {}

  login() {
    this.authService.login()
  }

  logout() {
    this.authService.logout()
  }

}
