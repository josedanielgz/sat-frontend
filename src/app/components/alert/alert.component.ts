import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  @Output() isClosed = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  close() {
    this.isClosed.emit(false);
  }

  onClick({ target }) {
    if (target.className === 'wrapper_alert') {
      this.close();
    }
  }
}
