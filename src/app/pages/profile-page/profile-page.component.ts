import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  nickname: string;
  description: string;
}

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent {
  nickname: string = 'Pali';
  description: string =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in est vitae libero congue dapibus ut a augue. Ut' +
    'vestibulum sapien vitae massa tristique luctus. Quisque et nisl nec urna dictum fermentum.';

  constructor(public dialog: MatDialog) {}

  openEditProfileDialog() {
    const dialogRef = this.dialog.open(EditProfileDialog, {
      data: { nickname: this.nickname, description: this.description },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (!result) return;
      this.nickname = result.nickname;
      this.description = result.description;
    });
  }
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
