import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducers';
import {
  getValueOfLocalStorage,
  saveInLocalStorage,
} from 'src/app/helpers/localStorage';
import { getColor } from 'src/app/helpers/ui';
import { User } from 'src/app/model/auth';
import { StatisticsRisk } from 'src/app/model/risk';
import { DeleteStudentsAction } from 'src/app/reducer/course/course.actions';
import { TeacherService } from 'src/app/services/teacher.service';

@Component({
  selector: 'app-table-risk',
  templateUrl: './table-risk.component.html',
  styleUrls: ['./table-risk.component.css'],
})
export class TableRiskComponent implements OnInit, OnDestroy {
  @Input() showFilter?: Boolean = true;
  subscription: Subscription = new Subscription();
  loading: boolean = true;
  loadingMore: Boolean = false;
  filter: String = '';
  show: boolean = false;
  page: number = 1;
  limit: Number = 15;
  totalPages: Number = 0;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private teacherService: TeacherService,
    private route: ActivatedRoute
  ) {}

  listStudents: User[];

  ngOnInit(): void {
    this.loading = true;
    this.subscription = this.store
      .select('course')
      .subscribe(({ students, totalPages }) => {
        this.listStudents = students;
        this.loading = false;
        this.totalPages = totalPages;
      });
  }

  navigateToStudent(userShow: User) {
    saveInLocalStorage('user-show', userShow);
    saveInLocalStorage('receiver', userShow);
    this.router.navigate(['/estudiante/informacion-permanencia']);
  }

  getColorRisk(risk: number) {
    if (risk) return getColor(risk).color;
    else {
      const statisticsRisk: StatisticsRisk =
        getValueOfLocalStorage('statisticsRisk');
      if (!statisticsRisk) return '';
      return statisticsRisk.risk === 'critico'
        ? 'red'
        : statisticsRisk.risk === 'moderado'
        ? 'orange'
        : 'yellow';
    }
  }

  async scrollDown(isFilter: Boolean = false) {
    this.page = this.page + 1;
    if (this.page <= this.totalPages) {
      this.loadingMore = true;
      const code = this.route.snapshot.paramMap.get('code');
      const group = this.route.snapshot.paramMap.get('group');
      await this.teacherService.listStudentsOfCourse(
        code,
        group,
        this.page,
        this.limit,
        this.filter,
        isFilter
      );
      this.loadingMore = false;
    }
  }

  showOptions() {
    this.show = !this.show;
  }

  async filterStudents(name: string = '') {
    this.loadingMore = true;
    this.filter = name;
    this.page = 0;
    this.totalPages = 1;
    await this.scrollDown(true);
    this.showOptions();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new DeleteStudentsAction());
  }
}
