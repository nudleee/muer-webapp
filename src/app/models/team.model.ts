import { Training } from './training.model';
import { User } from './user.model';

export interface Team {
  id: number;
  coach: User;
  members: User[];
  name: string;
  description: string;
  trainings: Training[];
}

export interface TeamResponse {
  data: Team[];
  page: number;
  total: number;
}

export interface TeamDTO {
  id: number;
  coach: User;
  members: User[];
  name: string;
  description: string;
  trainings: Training[];
}

export interface CreateTeam {
  name: string;
  coach: User;
  description: string;
}
