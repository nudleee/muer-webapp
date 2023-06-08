import { Injectable } from '@angular/core';
import { Team, TeamResponse } from '../models/team.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CreateTraining, Training, TrainingOption } from '../models/training.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiUrl = `${environment.backendUrl}/api/teams`;

  constructor(private http: HttpClient) {}

  getAllTeams(page: number = 1): Observable<TeamResponse> {
    const url = `${this.apiUrl}/all?page=${page}`;
    return this.http.get<TeamResponse>(url);
  }

  getTeams(page: number = 1, size: number = 10): Observable<TeamResponse> {
    const url = `${this.apiUrl}?page=${page}&size=${size}`;
    return this.http.get<TeamResponse>(url);
  }

  getTeamById(id: number): Observable<Team> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Team>(url);
  }

  getTrainings(): Observable<Training[]> {
    const url = `${this.apiUrl}/trainings`;
    return this.http.get<Training[]>(url);
  }

  addMember(id: number, user: User): Observable<Team> {
    const url = `${this.apiUrl}/${id}/members`;
    return this.http.post<Team>(url, user);
  }

  removeMember(id: number, user: User): Observable<void> {
    const url = `${this.apiUrl}/${id}/members`;
    return this.http.delete<void>(url, { body: user });
  }

  createTraining(id: number, training: CreateTraining): Observable<Team> {
    const url = `${this.apiUrl}/${id}/trainings`;
    return this.http.post<Team>(url, training);
  }

  deleteTraining(id: number, training: number): Observable<void> {
    const url = `${this.apiUrl}/${id}/trainings/${training}`;
    return this.http.delete<void>(url);
  }

  createTeam(team: any): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team);
  }

  updateTeam(id: number, team: Team): Observable<Team> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Team>(url, team);
  }

  deleteTeam(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
