export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface UserResponse {
  data: User[];
  page: number;
  total: number;
}
