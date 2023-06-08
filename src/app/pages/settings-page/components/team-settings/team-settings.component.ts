import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, throwError } from 'rxjs';
import { CreateTeam, Team, TeamDTO, TeamResponse } from 'src/app/models/team.model';
import { User } from 'src/app/models/user.model';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-team-settings',
  templateUrl: './team-settings.component.html',
  styleUrls: ['./team-settings.component.css'],
})
export class TeamSettingsComponent implements OnInit {
  pageIndex = 0;
  @Input()
  teams: TeamResponse | undefined;

  constructor(private teamService: TeamService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getTeams();
  }

  getTeams() {
    this.teamService.getTeams(this.pageIndex + 1).subscribe((teams) => {
      this.teams = teams;
      this.dataSource.data = teams.data;
    });
  }

  createTeam() {
    const dialogRef = this.dialog.open(UpsertTeamDialog, {
      data: { team: { name: '', coach: null, description: '' }, create: true },
    });
    dialogRef.afterClosed().subscribe((_) => {
      this.getTeams();
    });
  }

  editTeam(team: Team) {
    const dialogRef = this.dialog.open(UpsertTeamDialog, {
      data: {
        team: { name: team.name, coach: team.coach, description: team.description },
        create: false,
        original: team,
      },
    });
    dialogRef.afterClosed().subscribe((_) => {
      this.getTeams();
    });
  }

  deleteTeam(team: Team) {
    const dialogRef = this.dialog.open(DeleteTeamDialog, {
      data: { team: team },
    });
    dialogRef.afterClosed().subscribe((_) => {
      this.getTeams();
    });
  }

  getPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.getTeams();
  }

  columns = [
    {
      columnDef: 'name',
      header: 'Név',
      cell: (element: TeamDTO) => `${element.name}`,
    },
    {
      columnDef: 'coach',
      header: 'Edző neve',
      cell: (element: TeamDTO) => `${element.coach}`,
    },
    {
      columnDef: 'players',
      header: 'Csapattagok száma',
      cell: (element: TeamDTO) => `${element.members.length}`,
    },
    {
      columnDef: 'action',
      header: '',
      cell: () => '',
    },
  ];
  dataSource: MatTableDataSource<TeamDTO> = new MatTableDataSource<TeamDTO>([]);
  displayedColumns = this.columns.map((c) => c.columnDef);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

@Component({
  selector: 'upsert-team-dialog',
  templateUrl: 'upsert-team-dialog.html',
  styleUrls: ['./team-settings.component.css'],
})
export class UpsertTeamDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<UpsertTeamDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { team: CreateTeam; create: boolean; original: Team },
    private userService: UserService,
    private teamService: TeamService,
    private snack: SnackbarService,
  ) {}

  coaches: User[] | undefined;

  ngOnInit(): void {
    this.userService.getCoaches().subscribe((coaches) => {
      this.coaches = coaches;
    });
  }

  onSave() {
    if (this.data.create) {
      this.teamService
        .createTeam(this.data.team)
        .pipe(
          catchError((error) => {
            this.snack.showError('Sikertelen létrehozás');
            return throwError(error);
          }),
        )
        .subscribe((_) => {
          this.snack.showSuccess('Sikeres létrehozás');
          this.dialogRef.close();
        });
    } else {
      let team = this.data.original;
      team.name = this.data.team.name;
      team.coach = this.data.team.coach;
      team.description = this.data.team.description;
      console.log(team);
      this.teamService.updateTeam(this.data.original.id, team).subscribe((_) => {
        this.dialogRef.close();
      });
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'delete-team-dialog',
  templateUrl: 'delete-team-dialog.html',
  styleUrls: ['./team-settings.component.css'],
})
export class DeleteTeamDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteTeamDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { team: Team },
    private teamService: TeamService,
    private snack: SnackbarService,
  ) {}

  onDeleteClick() {
    this.teamService
      .deleteTeam(this.data.team.id)
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
