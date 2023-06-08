import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';


@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css'],
})
export class SettingsPageComponent implements OnInit {
  selected = new FormControl(0);
  isAdmin: boolean = false;
  isCoach: boolean = false;

  constructor(private authService: AuthServiceService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin() && !this.authService.isCoach()) {
      this.router.navigate(['access-denied']);
    }

    this.isAdmin = this.authService.isAdmin();
    this.isCoach = this.authService.isCoach();
    this.selected.setValue(this.isCoach ? 2 : 0);
  }
}
