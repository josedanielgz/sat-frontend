import { Component, OnInit } from '@angular/core';
import { Title } from 'src/app/model/ui';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-postulate-list',
  templateUrl: './postulate-list.component.html',
  styleUrls: ['./postulate-list.component.css'],
})
export class PostulateListComponent implements OnInit {
  title: Title = {
    title: 'Lista de postulados',
    subtitle:
      'Estudiantes postulados para ser tenidos en cuenta por su tipo de riesgo',
  };

  myProps = {
    type: 'postulator',
  };

  constructor(private uiService: UiService) {
    this.uiService.updateTitleNavbar('Postulados');
  }

  ngOnInit(): void {}
}
