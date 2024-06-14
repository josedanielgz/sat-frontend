import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import { filter, map } from 'rxjs/operators';
import { isTeacher } from 'src/app/helpers/ui';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  title: String;
  roleUser: String;
  subscription: Subscription = new Subscription();
  @ViewChild('menuNavBar') menuNavBar: ElementRef;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(
        filter(({ auth }) => auth.user !== null),
        map(({ auth, ui }) => ({
          role: auth.user.rol,
          title: ui.titleNavbar,
        }))
      )
      .subscribe(({ title, role }) => {
        this.title = title;
        this.roleUser = role;
      });
  }

  logout() {
    this.authService.logout(this.roleUser);
  }

  closeMenu() {
    this.menuNavBar.nativeElement.checked = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toHome() {
    if (isTeacher(this.roleUser) || this.roleUser === 'estudiante') {
      this.router.navigate([`/${this.roleUser}`]);
    } else {
      this.router.navigate(['/administrativo']);
    }
    this.closeMenu();
  }

  isTeacher(role: String) {
    return isTeacher(role);
  }
}
