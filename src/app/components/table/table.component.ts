import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { showAlert } from 'src/app/helpers/alert';
import { saveInLocalStorage } from 'src/app/helpers/localStorage';
import { Postulation } from 'src/app/model/risk';
import { BossService } from 'src/app/services/boss.service';
import { StudentService } from 'src/app/services/student.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit, OnDestroy {
  @Input() props: { type: String };
  page: number = 1;
  perPage: number = 1;
  totalPages: number[] = [1];
  showInfoPostulate: boolean = false;
  postulates: Postulation[] = [];
  postulation: Postulation = null;
  subscription: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bossService: BossService,
    private studentService: StudentService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.params
      .pipe(pluck('pagina'))
      .subscribe((page) => this.getPostulates(page));
    this.subscription2 = this.uiService.filter$.subscribe(async (code) => {
      if (code.length === 7 && code.match(/^[0-9]+$/)) {
        const data = await this.bossService.filterPostulation(code);
        if (!data) {
          showAlert('warning', 'No se encontrarón resultados');
        } else {
          this.updatePostulateModal(data);
        }
      }
    });
  }

  updatePostulateModal(
    postulation: Postulation,
    show: any = { show: true, id: null }
  ) {
    this.postulation = postulation;
    this.showInfoPostulate = show.show;
    if (show.id) this.getPostulates(this.page);
    this.uiService.filter$.emit('');
  }

  async getPostulates(page) {
    this.loading = true;
    const { data, totalPages } = await this.bossService.getPostulates(
      page,
      this.perPage
    );
    this.totalPages = Array(totalPages)
      .fill(0)
      .map((_, i) => i + 1);
    this.postulates = data;
    this.loading = false;
  }

  async toStudent(code: String) {
    this.loading = true;
    const { data } = await this.studentService.getByCode(code);
    saveInLocalStorage('user-show', data);
    saveInLocalStorage('receiver', data);
    this.router.navigate(['/estudiante']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
