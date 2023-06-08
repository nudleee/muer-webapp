import { User } from './user.model';

export interface CreateTraining {
  location: string;
  date: Date;
  startAt: string;
  description: string;
}

export interface TrainingDTO {
  id: number;
  createdBy: User;
  date: Date;
  startAt: string;
  participants: User[];
}

export interface Training {
  id: number;
  createdBy: User;
  participants: User[];
  location: string;
  date: Date;
  startAt: string;
  description: string;
  createdAt: Date;
}

export interface TrainingOption {
  id: number;
  date: Date;
  location: string;
  startAt: string;
}
