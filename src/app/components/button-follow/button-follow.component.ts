import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';

@Component({
  selector: 'app-button-follow',
  templateUrl: './button-follow.component.html',
  styleUrls: ['./button-follow.component.css'],
})
export class ButtonFollowComponent implements OnInit, OnDestroy {
  userRole: String;
  subscription: Subscription = new Subscription();

  constructor(private router: Router, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(
        filter(({ auth: { user } }) => user !== null),
        map(({ auth: { user } }) => user.rol)
      )
      .subscribe((role) => (this.userRole = role));
  }

  toFollow() {
    this.router.navigate(['/estudiante/notificar']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
