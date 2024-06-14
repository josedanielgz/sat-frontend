import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import {
  getValueOfLocalStorage,
  saveInLocalStorage,
} from 'src/app/helpers/localStorage';
import { User } from 'src/app/model/auth';
import { SetUserActiveAction } from 'src/app/reducer/ui/ui.actions';
import { StudentService } from 'src/app/services/student.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-profile-teacher',
  templateUrl: './profile-teacher.component.html',
  styleUrls: ['./profile-teacher.component.css'],
})
export class ProfileTeacherComponent implements OnInit, OnDestroy {
  user: User = null;
  subscription: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  constructor(
    private uiService: UiService,
    private studentService: StudentService,
    private store: Store<AppState>,
    private router: ActivatedRoute,
    private location: Location
  ) {
    this.uiService.updateTitleNavbar('Perfil Docente');
    const userShow = getValueOfLocalStorage('user-show');
    this.store.dispatch(new SetUserActiveAction(userShow));
  }

  ngOnInit(): void {
    this.subscription = this.router.params.subscribe(async (params) => {
      const { data } = await this.studentService.getTeacherOfCourse(
        params['code']
      );
      if (data) {
        saveInLocalStorage('user-show', data);
        this.store.dispatch(new SetUserActiveAction(data));
      } else {
        this.location.back();
      }
    });

    this.subscription2 = this.store
      .select('auth')
      .pipe(filter(({ user }) => user !== null))
      .subscribe(({ user }) => (this.user = user));
  }

  ngOnDestroy(): void {
    saveInLocalStorage('user-show', this.user);
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
