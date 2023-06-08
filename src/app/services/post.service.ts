import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePost, Post, PostResponse } from '../models/post.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = `${environment.backendUrl}/api/posts`;

  constructor(private http: HttpClient) {}

  getPosts(page: number, size: number): Observable<PostResponse> {
    const params = { page: String(page), size: String(size) };
    return this.http.get<PostResponse>(this.apiUrl, { params });
  }

  getPost(id: number): Observable<Post> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Post>(url);
  }

  createPost(post: CreatePost): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  updatePost(id: number, post: Post): Observable<Post> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Post>(url, post);
  }

  deletePost(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
