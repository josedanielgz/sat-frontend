import { EventEmitter, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';
import { Meet } from '../model/meet';
import { SetTitleNavbarAction } from '../reducer/ui/ui.actions';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  filter$ = new EventEmitter<String>();
  newMeet$ = new EventEmitter<Meet>();

  constructor(private store: Store<AppState>) {}

  updateTitleNavbar(newTitle: String = 'SAT') {
    this.store.dispatch(new SetTitleNavbarAction(newTitle));
  }
}
