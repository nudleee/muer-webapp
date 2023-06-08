import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, throwError } from 'rxjs';
import { CreatePost, Post, PostResponse, PostType } from 'src/app/models/post.model';
import { Training } from 'src/app/models/training.model';
import { PostService } from 'src/app/services/post.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-post-settings',
  templateUrl: './post-settings.component.html',
  styleUrls: ['./post-settings.component.css'],
})
export class PostSettingsComponent implements OnInit {
  pageIndex = 0;
  size = 10;

  posts: PostResponse | undefined;
  constructor(private postService: PostService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.postService.getPosts(this.pageIndex + 1, this.size).subscribe((posts) => {
      this.posts = posts;
      this.dataSource.data = posts.data;
    });
  }

  createPost() {
    const dialogRef = this.dialog.open(UpsertPostDialog, {
      data: { post: { title: '', description: '', type: PostType.DEFAULT, trainingId: -1 }, create: true },
    });

    dialogRef.afterClosed().subscribe((_) => {
      this.getPosts();
    });
  }

  editPost(post: Post) {
    const dialogRef = this.dialog.open(UpsertPostDialog, {
      data: {
        post: { title: post.title, description: post.description, type: post.type, trainingId: post.training?.id },
        original: post,
        create: false,
      },
    });

    dialogRef.afterClosed().subscribe((_) => {
      this.getPosts();
    });
  }

  deletePost(post: Post) {
    const dialogRef = this.dialog.open(DeletePostDialog, {
      data: {
        post: post,
      },
    });

    dialogRef.afterClosed().subscribe((_) => {
      this.getPosts();
    });
  }

  getPage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.postService.getPosts(this.pageIndex + 1, this.size).subscribe((posts) => {
      this.dataSource.data = posts.data;
    });
  }

  columns = [
    {
      columnDef: 'createdAt',
      header: 'Időbélyeg',
      cell: (element: Post) => `${element.createdAt}`,
    },
    {
      columnDef: 'createdBy',
      header: 'Szerző',
      cell: (element: Post) => `${element.createdBy.name}`,
    },
    {
      columnDef: 'title',
      header: 'Cím',
      cell: (element: Post) => `${element.title}`,
    },
    {
      columnDef: 'action',
      header: '',
      cell: () => '',
    },
  ];
  dataSource: MatTableDataSource<Post> = new MatTableDataSource<Post>([]);
  displayedColumns = this.columns.map((c) => c.columnDef);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource.filterPredicate = (data: Post) => {
      const value = data.title.toLowerCase();
      return value.includes(filterValue);
    };
    this.dataSource.filter = filterValue;
  }
}

@Component({
  selector: 'upsert-post-dialog',
  templateUrl: 'upsert-post-dialog.html',
  styleUrls: ['./post-settings.component.css'],
})
export class UpsertPostDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<UpsertPostDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { post: CreatePost; create: boolean; original: Post },
    private teamService: TeamService,
    private postService: PostService,
    private snack: SnackbarService,
  ) {}

  trainings: Training[] | undefined;

  ngOnInit(): void {
    this.teamService.getTrainings().subscribe((res) => {
      console.log(res);
      this.trainings = res;
    });
  }

  onSave() {
    if (this.data.create) {
      this.postService
        .createPost(this.data.post)
        .pipe(
          catchError((error) => {
            this.snack.showError('Sikertelen létrehozás');
            return throwError(error);
          }),
        )
        .subscribe((_) => {
          this.snack.showSuccess('Sikeres létrehozás');
          this.dialogRef.close();
        });
    } else {
      let post = this.data.original;
      post.title = this.data.post.title;
      post.type = this.data.post.type;
      post.training = this.trainings?.find((t) => t.id == this.data.post.trainingId);
      post.description = this.data.post.description;
      this.postService
        .updatePost(this.data.original.id, post)
        .pipe(
          catchError((error) => {
            this.snack.showError('Sikertelen módosítás');
            return throwError(error);
          }),
        )
        .subscribe((_) => {
          this.snack.showSuccess('Sikeres módosítás');
          this.dialogRef.close();
        });
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'delete-post-dialog',
  templateUrl: 'delete-post-dialog.html',
  styleUrls: ['./post-settings.component.css'],
})
export class DeletePostDialog {
  constructor(
    public dialogRef: MatDialogRef<DeletePostDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { post: Post },
    private postService: PostService,
    private snack: SnackbarService,
  ) {}

  onDeleteClick() {
    this.postService
      .deletePost(this.data.post.id)
      .pipe(
        catchError((error) => {
          this.snack.showError('Sikertelen eltávolítás');
          return throwError(error);
        }),
      )
      .subscribe((_) => {
        this.snack.showSuccess('Sikeres eltávolítás');
        this.dialogRef.close();
      });
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
