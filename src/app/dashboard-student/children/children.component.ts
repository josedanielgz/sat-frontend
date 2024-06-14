import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.css'],
})
export class ChildrenComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  loading: boolean = true;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(filter(({ auth }) => auth.user !== null))
      .subscribe(({ auth, ui: { loading } }) => {
        if (auth.user.rol === 'vicerrector') this.loading = false;
        else this.loading = loading;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
