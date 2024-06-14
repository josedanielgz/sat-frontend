import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterMeet } from 'src/app/model/meet';

@Component({
  selector: 'app-modal-meet',
  templateUrl: './modal-meet.component.html',
  styleUrls: ['./modal-meet.component.css'],
})
export class ModalMeetComponent implements OnInit {
  @Output() isClosed = new EventEmitter<FilterMeet>();

  formFilter: FormGroup;

  createFormFilter(): FormGroup {
    return new FormGroup({
      show: new FormControl(false),
      date: new FormControl(new Date().toISOString().split('T')[0]),
      state: new FormControl('ACEPTADA'),
    });
  }

  constructor() {
    this.formFilter = this.createFormFilter();
  }

  ngOnInit(): void {}

  onClick({ target }) {
    if (target.className.includes('wrapper_alert')) {
      this.close({
        show: false,
      });
    }
  }

  filter() {
    this.close(this.formFilter.value);
  }

  close(filter?: FilterMeet) {
    this.isClosed.emit(filter);
  }
}
