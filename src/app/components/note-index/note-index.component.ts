import { Component, Input, OnInit } from '@angular/core';
import { Note } from 'src/app/model/ui';

@Component({
  selector: 'app-note-index',
  templateUrl: './note-index.component.html',
  styleUrls: ['./note-index.component.css'],
})
export class NoteIndexComponent implements OnInit {
  @Input() note: Note;

  constructor() {}

  ngOnInit(): void {}
}
