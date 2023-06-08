import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User, UserResponse } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css'],
})
export class UserSettingsComponent implements OnInit {
  pageIndex = 0;

  users: UserResponse | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers(this.pageIndex + 1).subscribe((users) => {
      this.users = users;
      this.dataSource.data = users.data;
    });
  }

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
      cell: () => '',
    },
  ];

  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  displayedColumns = this.columns.map((c) => c.columnDef);

  getPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.userService.getUsers(this.pageIndex + 1).subscribe((users) => {
      this.dataSource.data = users.data;
    });
  }

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
