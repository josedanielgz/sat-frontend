import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, pluck, map } from 'rxjs/operators';
import { showAlert, showQuestion } from 'src/app/helpers/alert';
import {
  getValueOfLocalStorage,
  saveInLocalStorage,
} from 'src/app/helpers/localStorage';
import { normalizeRoles } from 'src/app/helpers/ui';
import { Profits } from 'src/app/model/profits';
import { Role } from 'src/app/model/role';
import { SuggestionItem } from 'src/app/model/suggestion';
import { Title } from 'src/app/model/ui';
import { UiService } from 'src/app/services/ui.service';
import { WellnessService } from 'src/app/services/wellness.service';
import { AppState } from 'src/app/app.reducers';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.css'],
})
export class SuggestionComponent implements OnInit, OnDestroy {
  title: Title = {
    title: 'Lista de sugerencias',
  };
  suggestions: SuggestionItem[];
  profits: Profits[];
  selections: any[] = [];
  loading: boolean = true;
  page: number = 1;
  perPage: number = 2;
  totalPages: number[] = [1];
  subscription: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();
  subscription3: Subscription = new Subscription();
  show: String = '';
  roles: Role[] = [];
  startDate: string = new Date().toISOString().split('T')[0];
  endDate: string = new Date().toISOString().split('T')[0];
  @ViewChild('options') options: ElementRef;
  @ViewChild('allCheck') allCheck: ElementRef;

  constructor(
    private uiService: UiService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private wellnessService: WellnessService
  ) {
    this.uiService.updateTitleNavbar('Sugerencias');
  }

  ngOnInit(): void {
    this.getProfits();
    this.subscription = this.route.params
      .pipe(pluck('pagina'))
      .subscribe((page = 1) => {
        const filter = getValueOfLocalStorage('filter');
        !filter ? this.getSuggestion(page) : this.onSubmit({ target: null });
      });
    this.subscription2 = this.uiService.filter$
      .pipe(
        filter((code) => code.length > 0),
        distinctUntilChanged()
      )
      .subscribe(async (code) => {
        if (code.length === 7 && code.match(/^[0-9]+$/)) {
          this.filterByCode(code);
        } else {
          showAlert('warning', 'Código incorrecto');
        }
      });
    this.subscription3 = this.store
      .select('role')
      .subscribe(({ roles }) => (this.roles = roles));
  }

  selected(index) {
    const select = !this.suggestions[index].select;
    const id = this.suggestions[index]._id;
    this.suggestions[index].select = select;
    if (select) {
      this.selections = [...this.selections, id];
    } else {
      this.selections = this.selections.filter((item) => item !== id);
      this.allCheck.nativeElement.checked = false;
    }
  }

  async responseSuggestion(action) {
    if (!this.selections.length) {
      showAlert('warning', 'Debe selecionar datos de la tabla');
    } else {
      const question = await showQuestion(
        'Está seguro de realizar la acción',
        'No se pueden revertir los cambios'
      );
      if (question.isConfirmed) {
        const data = {
          data: this.selections,
          action,
        };
        const res = await this.wellnessService.reponseSuggestion(data);
        !res.ok ? showAlert('error', res.msg) : this.nextPage();
      } else {
        this.allCheck.nativeElement.checked = false;
        this.suggestions = this.suggestions.map((item) => {
          item.select = false;
          return item;
        });
      }
      this.selections.length = 0;
    }
  }

  normalize(role: String) {
    return normalizeRoles(role);
  }

  nextPage() {
    this.suggestions = this.suggestions.filter(
      (valor) => !this.selections.includes(valor._id)
    );
    if (!this.suggestions.length) {
      if (this.page < this.totalPages.length) {
        const filter = getValueOfLocalStorage('filter');
        !filter
          ? this.getSuggestion(this.page)
          : this.onSubmit({ target: null });
      }
    }
  }

  all({ target }) {
    this.selections.length = 0;
    this.suggestions = this.suggestions.map((item) => {
      this.selections.push(item._id);
      item.select = target.checked;
      return item;
    });
    if (!target.checked) this.selections.length = 0;
  }

  getIcon(risk) {
    switch (risk) {
      case 'academico':
        return 'fas fa-id-badge';
      case 'individual':
        return 'fas fa-male';
      case 'socioeconomico':
        return 'fas fa-hand-holding-usd';
      case 'institucional':
        return 'fas fa-university';
      case 'psicologo':
        return 'fas fa-head-side-virus';
      case 'medico':
        return 'fas fa-user-md';
      case 'sacerdote':
        return 'fas fa-university';
      case 'trabajadorSocial':
        return 'fas fa-users';
      default:
        return 'fas fa-id-badge';
    }
  }

  async getProfits() {
    const profits = await this.wellnessService.getProfits();
    this.profits = profits;
  }

  changeShow(newShow) {
    this.show = newShow;
    this.options.nativeElement.checked = false;
    if (!newShow) {
      localStorage.removeItem('filter');
      this.getSuggestion(1);
    }
  }

  async onSubmit({ target }) {
    this.loading = true;
    let body = {};
    if (target) {
      const formName = target.name;
      if (formName === 'byDate') {
        const from = new Date(target[0].value);
        from.setHours(0);
        from.setMinutes(0);
        from.setSeconds(0);
        from.setMilliseconds(0);
        from.setDate(from.getDate() + 1);
        const to = new Date(target[1].value);
        to.setHours(0);
        to.setMinutes(0);
        to.setSeconds(0);
        to.setMilliseconds(0);
        to.setDate(to.getDate() + 1);
        body = {
          filter: formName,
          value: {
            from: from.toISOString(),
            to: to.toISOString(),
          },
        };
      } else {
        body = {
          filter: formName,
          value: target[0].value,
        };
      }
      saveInLocalStorage('filter', body);
    } else {
      const filter = getValueOfLocalStorage('filter');
      body = filter;
    }
    const res = await this.wellnessService.filterSuggestion(
      this.page,
      this.perPage,
      body
    );
    this.paginate(res);
  }

  async getSuggestion(page) {
    this.loading = true;
    const res = await this.wellnessService.paginateSuggestion(
      page,
      this.perPage
    );
    this.paginate(res);
  }

  async paginate(res) {
    this.suggestions = res.data;
    this.totalPages = Array(res.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
    this.loading = false;
  }

  async filterByCode(code) {
    this.loading = true;
    const res = await this.wellnessService.filterSuggestion(
      this.page,
      this.perPage,
      {
        filter: 'byCode',
        value: code,
      }
    );
    if (!code) showAlert('warning', 'No se encontrarón resultados');
    this.paginate(res);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }
}
