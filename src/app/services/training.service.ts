import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Training, TrainingOption } from '../models/training.model';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private baseUrl = `${environment.backendUrl}/api/trainings`;

  constructor(private http: HttpClient) {}

  addParticipant(id: number): Observable<Training> {
    return this.http.put<Training>(`${this.baseUrl}/${id}/participants`, null);
  }

  updateTraining(id: number, training: Training): Observable<Training> {
    return this.http.put<Training>(`${this.baseUrl}/${id}`, training);
  }

  removeParticipant(id: number, user: User): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { body: user });
  }
}
