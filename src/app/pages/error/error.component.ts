import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent implements OnInit {
  message: String = 'Ocurrio un error';
  path: String = '/';

  constructor(private location: Location, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store
      .select('ui')
      .pipe(filter(({ error }) => error.length > 0))
      .subscribe(({ error, path }) => {
        this.message = error;
        this.path = path;
      });
  }

  toHome() {
    this.location.back();
  }
}
