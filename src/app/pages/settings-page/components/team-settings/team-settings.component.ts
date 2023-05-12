import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface Team {
  name: string;
  coach: string;
  players: number;
}

@Component({
  selector: 'app-team-settings',
  templateUrl: './team-settings.component.html',
  styleUrls: ['./team-settings.component.css'],
})
export class TeamSettingsComponent {
  data = [
    { name: 'Anna', coach: 'Edző Elemér', players: 6 },
    { name: 'Anna', coach: 'Edző Elemér', players: 6 },
    { name: 'Anna', coach: 'Edző Elemér', players: 6 },
    { name: 'Anna', coach: 'Edző Elemér', players: 6 },
    { name: 'Anna', coach: 'Edző Elemér', players: 6 },
    { name: 'Anna', coach: 'Edző Elemér', players: 6 },
    { name: 'Anna', coach: 'Edző Elemér', players: 6 },
    { name: 'Anna', coach: 'Edző Elemér', players: 6 },
  ];

  columns = [
    {
      columnDef: 'name',
      header: 'Név',
      cell: (element: Team) => `${element.name}`,
    },
    {
      columnDef: 'coach',
      header: 'Edző neve',
      cell: (element: Team) => `${element.coach}`,
    },
    {
      columnDef: 'players',
      header: 'Csapattagok száma',
      cell: (element: Team) => `${element.players}`,
    },
  ];
  dataSource = new MatTableDataSource(this.data);
  displayedColumns = this.columns.map((c) => c.columnDef);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editTeam(element: Team) {
    console.log(element);
    alert(`edit ${element}`);
  }

  deleteTeam(element: Team) {
    console.log(element);
    alert(`delete ${element}`);
  }
}
