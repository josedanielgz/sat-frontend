import { Component, Input, OnInit } from '@angular/core';
import { desCourse } from 'src/app/model/ui';


@Component({
  selector: 'app-item-course-assistance',
  templateUrl: './item-course-assistance.component.html',
  styleUrls: ['./item-course-assistance.component.css']
})
export class ItemCourseAssistanceComponent implements OnInit {
  @Input() course: desCourse;
  courseClass=20;
  constructor() {
    
   }

  ngOnInit(): void {
    this.course.assistance = (this.course.assistance/this.courseClass)*100;
  }
   
}
