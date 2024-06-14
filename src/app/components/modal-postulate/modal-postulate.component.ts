import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { showAlert } from 'src/app/helpers/alert';
import { Postulation } from 'src/app/model/risk';
import { UpdateCounterAction } from 'src/app/reducer/notification/notification.actions';
import { BossService } from 'src/app/services/boss.service';

@Component({
  selector: 'app-modal-postulate',
  templateUrl: './modal-postulate.component.html',
  styleUrls: ['./modal-postulate.component.css'],
})
export class ModalPostulateComponent implements OnInit, OnDestroy {
  @Output() isClosed = new EventEmitter<any>();
  @Input() postulation: Postulation;
  loading: Boolean = false;
  role: String = '';

  subscription: Subscription = new Subscription();

  constructor(
    private bossService: BossService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('auth')
      .pipe(
        filter(({ user }) => user !== null),
        map(({ user }) => user.rol)
      )
      .subscribe((role) => (this.role = role));
  }

  onClick({ target }) {
    if (target.className.includes('wrapper_alert')) {
      this.close();
    }
  }

  close() {
    this.isClosed.emit({ show: false, id: null });
  }

  async attend() {
    this.loading = true;
    const id = this.postulation._id.$oid;
    const { ok } = await this.bossService.attendPostulation(id);
    this.loading = false;
    if (ok) {
      this.store.dispatch(new UpdateCounterAction());
      this.isClosed.emit({ show: false, id });
    } else {
      showAlert('error', 'No se pudo actualizar la postulación');
      this.isClosed.emit({ show: false, id: null });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
