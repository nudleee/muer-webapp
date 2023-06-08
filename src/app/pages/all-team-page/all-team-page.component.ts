import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TeamDTO, TeamResponse } from 'src/app/models/team.model';
import { TeamService } from 'src/app/services/team.service';
export interface TeamCard {
  id: number;
  name: string;
  coach: string;
  email: string;
}

@Component({
  selector: 'app-all-team-page',
  templateUrl: './all-team-page.component.html',
  styleUrls: ['./all-team-page.component.css'],
})
export class AllTeamPageComponent implements OnInit {
  pageIndex: number = 0;
  lowValue: number = 0;
  highValue: number = 4;

  constructor(private router: Router, private teamService: TeamService) {}

  teams: TeamResponse | undefined;

  ngOnInit(): void {
    this.teamService.getAllTeams(this.pageIndex + 1).subscribe((teams) => {
      this.teams = teams;
    });
  }

  getPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.teamService.getAllTeams(this.pageIndex + 1).subscribe((teams) => {
      this.teams = teams;
    });
  }

  navigate(item: TeamDTO) {
    this.router.navigate([`teams`, item.id]);
  }
}
