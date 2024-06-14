import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck } from 'rxjs/operators';
import { Title } from 'src/app/model/ui';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-search-student',
  templateUrl: './search-student.component.html',
  styleUrls: ['./search-student.component.css'],
})
export class SearchStudentComponent implements OnInit, OnDestroy {
  @Input() title: Title;

  @ViewChild('filter', { static: true }) filter: ElementRef;

  input$: Observable<String> = new Observable();
  subscription: Subscription = new Subscription();

  constructor(private location: Location, private uiService: UiService) {}

  ngOnInit(): void {
    this.input$ = fromEvent(this.filter.nativeElement, 'keyup');
    this.subscription = this.input$
      .pipe(
        debounceTime(1000),
        pluck('target', 'value'),
        distinctUntilChanged()
      )
      .subscribe((filter: String) => this.uiService.filter$.emit(filter));
  }

  goBack() {
    this.location.back();
  }

  cleanInput() {
    this.filter.nativeElement.value = '';
    this.uiService.filter$.emit('');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
