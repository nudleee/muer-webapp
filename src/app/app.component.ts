import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from './services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'muer-webapp';

  constructor(private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.authService.tryForLogin();
  }
}
