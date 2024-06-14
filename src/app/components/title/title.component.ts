import { Component, Input, OnInit } from '@angular/core';
import { Title } from 'src/app/model/ui';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css'],
})
export class TitleComponent implements OnInit {
  @Input() title: Title;

  constructor() {}

  ngOnInit(): void {}
}
