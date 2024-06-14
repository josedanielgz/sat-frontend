import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { isAdministrative, isTeacher } from 'src/app/helpers/ui';
import { User } from 'src/app/model/auth';
import { Postulation } from 'src/app/model/risk';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-validate-postulation',
  templateUrl: './validate-postulation.component.html',
  styleUrls: ['./validate-postulation.component.css'],
})
export class ValidatePostulationComponent implements OnInit {
  @Input() user: User;
  @Input() userShow: User;
  showDescription: boolean = false;
  postulation: Postulation = null;
  isAdmin: Boolean = false;
  isTeacher: Boolean = false;

  constructor(
    private studentService: StudentService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.validate();
    this.store
      .select('role')
      .pipe(
        map(({ roles }) => ({
          isAdmin: isAdministrative(roles, this.user.rol) ? true : false,
          isTeacher: isTeacher(this.user.rol),
        }))
      )
      .subscribe(({ isAdmin, isTeacher }) => {
        this.isAdmin = isAdmin;
        this.isTeacher = isTeacher;
      });
  }

  updateShowDescription(show: boolean = true) {
    this.showDescription = show;
  }

  async validate() {
    const { programa, correo, rol, nombre, apellido, codigo } = this.userShow;
    const data = {
      student: {
        programa,
        codigo,
        correo,
        rol,
        nombre: `${nombre} ${apellido}`,
      },
      isActive: true,
    };
    const postulation = await this.studentService.validatePostulation(data);
    this.postulation = postulation;
  }
}
