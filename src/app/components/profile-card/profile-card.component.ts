import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { User } from 'src/app/model/auth';
import { Subscription } from 'rxjs';
import { MenuOptions } from 'src/app/model/ui';
import { menuRoutes } from 'src/app/model/data';
import { map, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { StudentService } from 'src/app/services/student.service';
import {
  LoadRiskAction,
  SetRiskGlobalAction,
} from 'src/app/reducer/risk/risk.action';
import { getColor } from 'src/app/helpers/ui';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css'],
})
export class ProfileCardComponent implements OnInit, OnDestroy {
  @ViewChild('checkbox') checkbox: ElementRef;

  user: User = null;
  userShow: User = null;
  subscription: Subscription = new Subscription();
  routes: MenuOptions[] = menuRoutes;
  title: String;
  showUpdateProfile: boolean = false;
  loading: boolean = true;
  color: String = 'gray';
  risk: String = 'Obteniedo riesgo...';

  constructor(
    private location: Location,
    private store: Store<AppState>,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private chatService: ChatService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(
        filter(({ auth, ui }) => auth.user !== null && ui.userActive != null),
        map(({ auth, ui }) => ({
          user: auth.user,
          title: ui.titleNavbar,
          userActive: ui.userActive,
        })),
        tap(({ title }) => (this.title = title)),
        distinctUntilChanged(
          (x, y) => x.userActive.codigo === y.userActive.codigo
        )
      )
      .subscribe(({ user, userActive }) => {
        this.user = user;
        const code = this.activatedRouter.snapshot.paramMap.get('code');
        if (code) this.getTeacher(code);
        else this.getRisk(userActive);
      });
  }

  async getTeacher(code: String) {
    const res = await this.studentService.getTeacherOfCourse(code);
    if (res.ok) {
      this.userShow = res.data;
    } else {
      this.router.navigate(['/estudiante']);
    }
    this.loading = false;
  }

  goBack() {
    this.location.back();
  }

  toChatAdmin() {
    this.router.navigate(['/estudiante/chat-admin/' + this.userShow.codigo]);
  }

  toNavigate() {
    this.checkbox.nativeElement.checked = false;
  }

  updateProfile(show: boolean = true) {
    this.showUpdateProfile = show;
  }

  closeMenu(e: FocusEvent) {
    if (!e.relatedTarget) {
      this.toNavigate();
    }
  }

  contact() {
    this.chatService.getMessages(this.userShow);
  }

  toFollowUp() {
    this.router.navigate(['/estudiante/notificar']);
  }

  async getRisk(user) {
    this.userShow = user;
    if (this.userShow.rol === 'estudiante') {
      const { riesgos } = await this.studentService.getRisk(user.codigo);
      this.userShow = {
        ...user,
      };
      console.log(user);
      const { color, risk } = getColor(user.riesgo);
      this.color = color;
      this.risk = color !== 'green' ? risk.split('en')[1] : risk;
      this.store.dispatch(new LoadRiskAction(riesgos));
      this.store.dispatch(new SetRiskGlobalAction(user.riesgo));
    }
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
