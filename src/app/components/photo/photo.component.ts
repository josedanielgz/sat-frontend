import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import {
  getValueOfLocalStorage,
  saveInLocalStorage,
} from 'src/app/helpers/localStorage';
import { blobFile } from 'src/app/helpers/photo';
import { UpdatePhotoUserAction } from 'src/app/reducer/auth/auth.actions';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css'],
})
export class PhotoComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  photo: String = '';
  show: Boolean = false;
  isEdit: Boolean = false;
  newPhoto: any = null;
  loading: Boolean = false;
  role: String = '';
  name: String = '';
  @Input() isAdmin?: Boolean = false;

  constructor(
    private store: Store<AppState>,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .pipe(
        map(({ auth: { user }, ui: { userActive } }) => ({ user, userActive })),
        filter(({ user }) => user !== null)
      )
      .subscribe(({ user, userActive }) => {
        this.role = this.isAdmin ? user.rol : userActive.rol;
        this.photo = this.isAdmin ? user.foto : userActive.foto;
        const nombre = this.isAdmin ? user.nombre : userActive.nombre;
        const apellido = this.isAdmin ? user.apellido : userActive.apellido;
        this.name = `${nombre.charAt(0)}${apellido.charAt(0)}`;
        this.show = this.isAdmin || user.rol === userActive.rol;
      });
  }

  async onFileSelected(event: any) {
    const imagen = event.target.files[0];
    if (imagen && imagen.type.includes('image')) {
      const res: any = await blobFile(imagen, this.sanitizer);
      if (res) {
        this.photo = res.base;
        this.isEdit = true;
        this.newPhoto = imagen;
      } else {
        this.isEdit = false;
        this.newPhoto = null;
      }
    }
  }

  async loadImage() {
    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.newPhoto);
    const res = await this.authService.uploadPhoto(formData);
    const userShow = getValueOfLocalStorage('user-show');
    if (res.ok) {
      if (this.role === 'estudiante') {
        userShow.foto = res.data;
        saveInLocalStorage('user-show', userShow);
      } else {
        console.log(res.data);
        if (res.token) {
          this.store.dispatch(new UpdatePhotoUserAction(res.data));
          localStorage.setItem('x-token', res.token.toString());
        } else {
          userShow.foto = res.data;
          saveInLocalStorage('user-show', userShow);
        }
      }
      this.isEdit = false;
    }
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
