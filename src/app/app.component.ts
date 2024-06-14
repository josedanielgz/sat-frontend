import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './app.reducers';
import { AddUserAction, RemoveUserAction } from './reducer/auth/auth.actions';
import { LoadRoleAction } from './reducer/role/role.action';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.renewToken();
  }

  ngOnInit(): void {
    this.getRoles();
  }

  async renewToken() {
    this.loading = true;
    try {
      const req = await this.authService.renewToken();
      const { data, token } = req;
      localStorage.setItem('x-token', token.toString());
      this.store.dispatch(new AddUserAction(data));
    } catch (error) {
      this.store.dispatch(new RemoveUserAction());
    }
    this.loading = false;
  }

  async getRoles() {
    const res = await this.authService.listRoles();
    if (!res.hasOwnProperty('ok')) this.store.dispatch(new LoadRoleAction(res));
  }
}
