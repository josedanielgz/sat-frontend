import { Component, Input, OnInit } from '@angular/core';
import { Postulation } from 'src/app/model/risk';

@Component({
  selector: 'app-button-notification',
  templateUrl: './button-notification.component.html',
  styleUrls: ['./button-notification.component.css'],
})
export class ButtonNotificationComponent implements OnInit {
  @Input() postulation: Postulation;

  showDate: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  showDateNotification(show: boolean = true) {
    this.showDate = show;
  }
}
