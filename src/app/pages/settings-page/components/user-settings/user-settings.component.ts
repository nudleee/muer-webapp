import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface User {
  name: string;
  role: string;
}

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css'],
})
export class UserSettingsComponent {
  data = [
    { name: 'Anna', role: 'Admin' },
    { name: 'Anna', role: 'Admin' },
    { name: 'Anna', role: 'Admin' },
    { name: 'Anna', role: 'Admin' },
    { name: 'Anna', role: 'Admin' },
    { name: 'Anna', role: 'Admin' },
    { name: 'Anna', role: 'Admin' },
    { name: 'Anna', role: 'Admin' },
  ];

  columns = [
    {
      columnDef: 'name',
      header: 'Név',
      cell: (element: User) => `${element.name}`,
    },
    {
      columnDef: 'role',
      header: 'Hatáskör',
      cell: (element: User) => `${element.role}`,
    },
    {
      columnDef: 'action',
      header: '',
      cell: (element: User) => ``,
    },
  ];
  dataSource = new MatTableDataSource(this.data);
  displayedColumns = this.columns.map((c) => c.columnDef);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editUser(element: User) {
    console.log(element);
    alert(`edit ${element}`);
  }

  deleteUser(element: User) {
    console.log(element);
    alert(`delete ${element}`);
  }
}
