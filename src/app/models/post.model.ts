import { Training } from './training.model';
import { User } from './user.model';

export interface Post {
  id: number;
  title: string;
  description: string;
  createdBy: User;
  createdAt: Date;
  image?: string;
  type: PostType;
  training?: Training;
}

export enum PostType {
  EVENT = 'EVENT',
  TRAINING = 'TRAINING',
  DEFAULT = 'DEFAULT',
}

export interface CreatePost {
  title: string;
  description: string;
  type: PostType;
  trainingId: number;
}

export interface PostResponse {
  data: Post[];
  page: number;
  total: number;
}
