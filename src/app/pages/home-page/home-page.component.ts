import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountInfo } from '@azure/msal-browser';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Subscription, catchError, throwError } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Post, PostResponse } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TrainingService } from 'src/app/services/training.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  subscription: Subscription | null = null;
  currentUser: AccountInfo | null = null;
  constructor(
    private http: HttpClient,
    private authService: AuthServiceService,
    private snackBar: MatSnackBar,
    private postService: PostService,
    private trainingService: TrainingService,
    private snack: SnackbarService,
  ) {}

  pageIndex: number = 0;
  size: number = 10;
  posts: PostResponse | undefined;

  getPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.postService.getPosts(this.pageIndex + 1, this.size).subscribe((posts) => (this.posts = posts));
  }

  ngOnInit(): void {
    console.log(this.authService.currentUser.value);
    this.subscription = this.authService.getUserListener().subscribe((user) => (this.currentUser = user));
    this.postService.getPosts(this.pageIndex + 1, this.size).subscribe((posts) => (this.posts = posts));
  }

  addParticipant(item: Post) {
    this.trainingService
      .addParticipant(item.training?.id!!)
      .pipe(
        catchError((error) => {
          this.snack.showError('Sikertelen jelentkezés');
          return throwError(error);
        }),
      )
      .subscribe((_) => {
        this.snack.showSuccess('Sikeres jelentkezés');
      });
  }

  load() {
    this.http.get(`${environment.backendUrl}/api/user`).subscribe((data) => console.log(data));
  }
}
