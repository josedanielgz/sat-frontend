import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { showAlert } from 'src/app/helpers/alert';
import { saveInLocalStorage } from 'src/app/helpers/localStorage';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-search-global',
  templateUrl: './search-global.component.html',
  styleUrls: ['./search-global.component.css'],
})
export class SearchGlobalComponent implements OnInit {
  loadingSearch: boolean = false;

  formSearch: FormGroup;

  createFormSearch(): FormGroup {
    return new FormGroup({
      filter: new FormControl('1151157', Validators.required),
    });
  }

  constructor(private router: Router, private studentService: StudentService) {
    this.formSearch = this.createFormSearch();
  }

  ngOnInit(): void {}

  async onSubmit() {
    if (!this.formSearch.invalid) {
      this.loadingSearch = true;
      const code = this.formSearch.get('filter');
      const { data, msg } = await this.studentService.getByCode(code.value);
      if (!data) {
        showAlert('warning', msg);
      } else {
        saveInLocalStorage('receiver', data);
        saveInLocalStorage('user-show', data);
        this.router.navigate(['/estudiante']);
      }
      this.loadingSearch = false;
    }
  }

  get filter() {
    return this.formSearch.get('filter');
  }
}
