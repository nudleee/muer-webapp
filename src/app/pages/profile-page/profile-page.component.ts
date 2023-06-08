import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AccountInfo } from '@azure/msal-browser';
import { TeamDTO, TeamResponse } from 'src/app/models/team.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { TeamService } from 'src/app/services/team.service';

export interface DialogData {
  name: string;
  nickname: string;
  description: string;
}

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  nickname: string = '';
  description: string = '';
  role: string = '';
  name: string = '';
  currentUser: AccountInfo | null = null;
  pageIndex = 0;
  teams: TeamResponse | undefined;

  constructor(
    public dialog: MatDialog,
    private authService: AuthServiceService,
    private teamService: TeamService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.getUserListener().subscribe((user) => (this.currentUser = user));
    if (this.currentUser != null) {
      this.name =
        this.currentUser.idTokenClaims?.['family_name'] + ' ' + this.currentUser?.idTokenClaims?.['given_name'];
      this.nickname = this.currentUser.idTokenClaims?.['extension_Nickname'] as string;
      this.role = this.currentUser.idTokenClaims?.['extension_Role'] as string;
      this.description = this.currentUser.idTokenClaims?.['extension_Description'] as string;
    }
    this.teamService.getTeams(this.pageIndex + 1, 2).subscribe((teams) => {
      this.teams = teams;
    });
  }

  getPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.teamService.getTeams(this.pageIndex + 1, 2).subscribe((teams) => {
      this.teams = teams;
    });
  }

  navigate(item: TeamDTO) {
    this.router.navigate([`teams`, item.id]);
  }

  openEditProfileDialog() {}
}

@Component({
  selector: 'edit-profile-dialog',
  templateUrl: 'edit-profile-dialog.html',
  styleUrls: ['./profile-page.component.css'],
})
export class EditProfileDialog {
  constructor(public dialogRef: MatDialogRef<EditProfileDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onCancelClick() {
    this.dialogRef.close();
  }
}
