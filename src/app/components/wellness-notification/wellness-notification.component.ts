import { Component, OnInit } from '@angular/core';
import { ServicesWellness } from 'src/app/model/ui';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-wellness-notification',
  templateUrl: './wellness-notification.component.html',
  styleUrls: ['./wellness-notification.component.css'],
})
export class WellnessNotificationComponent implements OnInit {
  servicesWellness: ServicesWellness[] = [];
  constructor(private iuservices: UiService) {
    this.iuservices.updateTitleNavbar('Perfil');
  }

  ngOnInit(): void {}
}
