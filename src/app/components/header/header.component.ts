import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountInfo } from '@azure/msal-browser';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthServiceService, private router: Router) {}

  ngOnInit(): void {
    this.authenticatedUserSubscription = this.authService.getUserListener().subscribe((user) => {
      this.currentUser = user;
      this.isAdmin = this.authService.isAdmin();
      this.isCoach = this.authService.isCoach();
    });
  }

  authenticatedUserSubscription: Subscription | undefined;
  currentUser: AccountInfo | null = null;
  isAdmin: boolean = false;
  isCoach: boolean = false;

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['home']);
  }
}
