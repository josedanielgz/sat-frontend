import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { showAlert } from 'src/app/helpers/alert';
import { saveInLocalStorage } from 'src/app/helpers/localStorage';
import { LoadStatisticsAction } from 'src/app/reducer/risk/risk.action';
import { StudentService } from 'src/app/services/student.service';
import { UiService } from 'src/app/services/ui.service';
import { WellnessService } from 'src/app/services/wellness.service';

@Component({
  selector: 'app-semester',
  templateUrl: './semester.component.html',
  styleUrls: ['./semester.component.css'],
})
export class SemesterComponent implements OnInit, OnDestroy {
  semesters: String[] = [];
  loading: boolean = false;
  loadingSearch: boolean = false;
  program: String = '';
  subscription: Subscription = new Subscription();
  formSearch: FormGroup;

  createFormSearch(): FormGroup {
    return new FormGroup({
      filter: new FormControl('1151157', Validators.required),
    });
  }

  constructor(
    private uiService: UiService,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private router: Router,
    private store: Store<AppState>,
    private wellnessSevice: WellnessService
  ) {
    this.formSearch = this.createFormSearch();
    this.uiService.updateTitleNavbar('Semestres');
  }

  ngOnInit(): void {
    this.subscription = this.store
      .select('auth')
      .pipe(filter(({ user }) => user !== null))
      .subscribe(({ user }) =>
        user.rol === 'jefe'
          ? (this.program = user.programa)
          : (this.program = decodeURI(
              this.route.snapshot.paramMap.get('nombre')
            ))
      );
    this.wellnessSevice.validateProgram(this.program);
    this.store.dispatch(
      new LoadStatisticsAction({
        program: this.program,
        risk: null,
      })
    );
    this.getPeriods();
  }

  async getPeriods() {
    this.loading = true;
    let currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentSemester = currentMonth <= 7 ? 1 : 2;
    for (let i = currentYear; i >= 2010; i--) {
      this.semesters.push(`${i}-2`);
      this.semesters.push(`${i}-1`);
    }
    if (currentSemester === 1) this.semesters.shift();
    this.loading = false;
  }

  async onSubmit() {
    if (!this.formSearch.invalid) {
      this.loadingSearch = true;
      const code = this.formSearch.get('filter');
      const { data, msg } = await this.studentService.getByCode(code.value);
      if (!data) {
        showAlert('warning', msg);
      } else {
        saveInLocalStorage('receiver', data);
        saveInLocalStorage('user-show', data);
        this.router.navigate(['/estudiante']);
      }
      this.loadingSearch = false;
    }
  }

  get filter() {
    return this.formSearch.get('filter');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
