import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { User } from 'src/app/model/auth';
import { distinctUntilChanged, filter, map, pluck } from 'rxjs/operators';

@Component({
  selector: 'app-profile-teacher-teacher',
  templateUrl: './profile-teacher-teacher.component.html',
  styleUrls: ['./profile-teacher-teacher.component.css'],
})
export class ProfileTeacherTeacherComponent implements OnInit {
  user: User = null;
  subscription: Subscription = new Subscription();
  loading: boolean = false;
  title: String = '';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('auth')
      .pipe(
        map(({ user }) => ({ user })),
        filter(({ user }) => user !== null),
        distinctUntilChanged()
      )
      .subscribe(({ user }) => {
        this.user = user;
      });
  }
}
