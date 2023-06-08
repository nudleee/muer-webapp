import { style, trigger, state, transition, animate } from '@angular/animations';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { Team } from 'src/app/models/team.model';
import { Training, TrainingDTO } from 'src/app/models/training.model';
import { User } from 'src/app/models/user.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { TeamService } from 'src/app/services/team.service';
import { TrainingService } from 'src/app/services/training.service';
import { UserService } from 'src/app/services/user.service';

import { catchError } from 'rxjs/operators';
import { SnackbarService } from 'src/app/services/snackbar.service';

export interface TeamDialogData {
  name: string;
  description: string;
}

export interface TeamTrainingData {
  date: string;
  startAt: string;
  coach: string;
  participants: number;
  location: string;
  description: string;
}

export interface UserData {
  name: string;
  role: string;
  id: string;
  date: string;
}

@Component({
  selector: 'app-team-page',
  templateUrl: './team-page.component.html',
  styleUrls: ['./team-page.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TeamPageComponent implements OnInit {
  isAdmin: boolean = false;
  isCoach: boolean = false;
  @Input()
  teamId: number = -1;
  team: Team | undefined;
  teamPageIndex = 0;
  teamMin = 0;
  teamMax = 10;
  userPageIndex = 0;
  userMin = 0;
  userMax = 10;

  authenticatedUserSubscription: Subscription | undefined;
  currentUser: string | undefined;

  constructor(
    public dialog: MatDialog,
    private authService: AuthServiceService,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private trainingService: TrainingService,
    private snack: SnackbarService,
  ) {}

  isParticipant(training: Training, user: User) {
    return training.participants.some((p) => p.id == user.id);
  }
  getTrainings() {
    this.teamService.getTeamById(this.teamId).subscribe((team) => {
      this.team = team;
      this.teamDataSource.data = this.team?.trainings.slice(this.teamMin, this.teamMax) || [];
      this.userDataSource.data = this.team?.members || [];
    });
  }

  ngOnInit(): void {
    this.authenticatedUserSubscription = this.authService.getUserListener().subscribe((user) => {
      this.currentUser = user?.idTokenClaims?.oid;
      this.isAdmin = this.authService.isAdmin();
      this.isCoach = this.authService.isCoach();
    });

    this.route.params.subscribe((params) => {
      this.teamId = params['teamId'];
    });

    this.getTrainings();

    this.displayedTeamColumns = this.teamColumns.map((c) => c.columnDef);

    this.displayedUserColumns = this.userColumns.map((c) => c.columnDef);
  }

  nextTrainingPage(event: PageEvent) {
    this.teamPageIndex = event.pageIndex;
    this.teamMin = this.teamPageIndex * 10;
    this.teamMax = this.teamMin + 10;
    this.teamDataSource.data = this.team?.trainings.slice(this.teamMin, this.teamMax) || [];
  }

  nextUserPage(event: PageEvent) {
    this.userPageIndex = event.pageIndex;
    this.userMin = this.userPageIndex * 10;
    this.userMax = this.userMin + 10;
    this.userDataSource.data = this.team?.members.slice(this.teamMin, this.teamMax) || [];
  }

  editTeam() {
    const dialogRef = this.dialog.open(EditTeamDialog, {
      data: { team: { name: this.team?.name, description: this.team?.description }, original: this.team },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.getTrainings();
    });
  }

  createTraining() {
    const dialogRef = this.dialog.open(UpsertTrainingDialog, {
      data: { teamId: this.teamId, training: { date: '', location: '', startAt: '', description: '' }, create: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getTrainings();
    });
  }

  editTraining(item: Training) {
    const dialogRef = this.dialog.open(UpsertTrainingDialog, {
      data: {
        teamId: this.teamId,
        training: { date: item.date, location: item.location, startAt: item.startAt },
        create: false,
        original: item,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.getTrainings();
    });
  }

  deleteTraining(item: Training) {
    const dialogRef = this.dialog.open(DeleteTrainingDialog, { data: { training: item.id, team: this.teamId } });
    dialogRef.afterClosed().subscribe((res) => {
      this.getTrainings();
    });
  }

  addParticipant(item: Training) {
    this.trainingService
      .addParticipant(item.id)
      .pipe(
        catchError((error) => {
          this.snack.showError('Sikertelen jelentkezés');
          return throwError(error);
        }),
      )
      .subscribe((_) => {
        this.snack.showSuccess('Sikeres jelentkezés');
        this.getTrainings();
      });
  }

  removeParticipant(item: Training, user: User) {
    this.trainingService
      .removeParticipant(item.id, user)
      .pipe(
        catchError((error) => {
          this.snack.showError('Sikertelen lejelntkezés');
          return throwError(error);
        }),
      )
      .subscribe((_) => {
        this.snack.showSuccess('Sikeres lejelentkezés');
        this.getTrainings();
      });
  }

  addMember() {
    const dialogRef = this.dialog.open(AddMemberDialog, {
      data: { teamId: this.teamId, user: null },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.getTrainings();
    });
  }

  teamColumns = [
    {
      columnDef: 'date',
      header: 'Dátum',
      cell: (element: TeamTrainingData) => `${element.date}`,
    },
    {
      columnDef: 'startAt',
      header: 'Időpont',
      cell: (element: TeamTrainingData) => `${element.startAt}`,
    },
    {
      columnDef: 'coach',
      header: 'Edző',
      cell: (element: TeamTrainingData) => `${element.coach}`,
    },
    {
      columnDef: 'participants',
      header: 'Férőhely',
      cell: (element: TeamTrainingData) => `${element.participants} / 18`,
    },
    {
      columnDef: 'action',
      header: '',
      cell: () => ``,
    },
  ];
  teamDataSource: MatTableDataSource<TrainingDTO> = new MatTableDataSource<TrainingDTO>([]);
  displayedTeamColumns: string[] = [];

  expandedElement: TeamTrainingData | null = null;

  openMenu(event: Event) {
    event.stopPropagation();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userDataSource.filter = filterValue.trim().toLowerCase();
  }

  userColumns = [
    {
      columnDef: 'name',
      header: 'Név',
      cell: (element: UserData) => `${element.name}`,
    },
    {
      columnDef: 'action',
      header: '',
      cell: () => ``,
    },
  ];
  userDataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  displayedUserColumns: string[] = [];

  removeMember(user: User) {
    const dialogRef = this.dialog.open(RemoveMemberDialog, { data: { team: this.teamId, user: user } });
    dialogRef.afterClosed().subscribe((res) => {
      this.getTrainings();
    });
  }
}

@Component({
  selector: 'edit-team-dialog',
  templateUrl: 'edit-team-dialog.html',
  styleUrls: ['./team-page.component.css'],
})
export class EditTeamDialog {
  constructor(
    public dialogRef: MatDialogRef<EditTeamDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { team: Team; original: Team },
    private snack: SnackbarService,
    private teamService: TeamService,
  ) {}

  onSave() {
    let team = this.data.original;
    team.name = this.data.team.name;
    team.description = this.data.team.description;
    this.teamService
      .updateTeam(this.data.original.id, team)
      .pipe(
        catchError((error) => {
          console.log(error);
          this.snack.showError('Sikertelen módosítás');
          return throwError(error);
        }),
      )
      .subscribe((_) => {
        this.snack.showSuccess('Sikeres módosítás');
        this.dialogRef.close();
      });
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'upsert-training-dialog',
  templateUrl: 'upsert-training-dialog.html',
  styleUrls: ['./team-page.component.css'],
})
export class UpsertTrainingDialog {
  constructor(
    public dialogRef: MatDialogRef<UpsertTrainingDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: { teamId: number; training: Training; create: boolean; original: Training },
    private snack: SnackbarService,
    private teamService: TeamService,
    private trainingService: TrainingService,
  ) {}

  onSave() {
    if (this.data.create) {
      this.teamService
        .createTraining(this.data.teamId, this.data.training)
        .pipe(
          catchError((error) => {
            this.snack.showError('Sikertelen kiírás');
            return throwError(error);
          }),
        )
        .subscribe((_) => {
          this.snack.showSuccess('Sikeres kiírás');
          this.dialogRef.close();
        });
    } else {
      let training = this.data.original;
      training.date = this.data.training.date;
      training.location = this.data.training.location;
      training.startAt = this.data.training.startAt;
      training.description = this.data.training.description;
      this.trainingService
        .updateTraining(training.id, training)
        .pipe(
          catchError((error) => {
            this.snack.showError('Sikertelen módosítás');
            return throwError(error);
          }),
        )
        .subscribe((_) => {
          this.snack.showSuccess('Sikeres módosítás');
          this.dialogRef.close();
        });
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'delete-training-dialog',
  templateUrl: 'delete-training-dialog.html',
  styleUrls: ['./team-page.component.css'],
})
export class DeleteTrainingDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteTrainingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { training: number; team: number },
    private teamService: TeamService,
    private snack: SnackbarService,
  ) {}

  onDeleteClick() {
    this.teamService
      .deleteTraining(this.data.team, this.data.training)
      .pipe(
        catchError((error) => {
          this.snack.showError('Sikertelen eltávolítás');
          return throwError(error);
        }),
      )
      .subscribe((_) => {
        this.snack.showSuccess('Sikeres eltávolítás');
        this.dialogRef.close();
      });
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'remove-member-dialog',
  templateUrl: 'remove-member-dialog.html',
  styleUrls: ['./team-page.component.css'],
})
export class RemoveMemberDialog {
  constructor(
    public dialogRef: MatDialogRef<RemoveMemberDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { team: number; user: User },
    private teamService: TeamService,
    private snack: SnackbarService,
  ) {}

  onDeleteClick() {
    this.teamService
      .removeMember(this.data.team, this.data.user)
      .pipe(
        catchError((error) => {
          this.snack.showError('Sikertelen eltávolítás');
          return throwError(error);
        }),
      )
      .subscribe((_) => {
        this.snack.showSuccess('Sikeres eltávolítás');
        this.dialogRef.close();
      });
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'add-member-dialog',
  templateUrl: 'add-member-dialog.html',
  styleUrls: ['./team-page.component.css'],
})
export class AddMemberDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddMemberDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { teamId: number; user: User },
    private userService: UserService,
    private teamService: TeamService,
    private snack: SnackbarService,
  ) {}

  users: User[] | undefined;

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((res) => {
      this.users = res;
    });
  }

  onSave() {
    this.teamService
      .addMember(this.data.teamId, this.data.user)
      .pipe(
        catchError((error) => {
          this.snack.showError('Sikertelen felvétel');
          return throwError(error);
        }),
      )
      .subscribe((_) => {
        this.snack.showSuccess('Sikeres felvétel');
        this.dialogRef.close();
      });
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
