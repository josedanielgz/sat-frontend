import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { pluck, filter, map } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { dateHourFormat } from 'src/app/helpers/ui';
import { MeetPsychology } from 'src/app/model/meetPsychology';
import { ResponseHistotyMett } from 'src/app/model/responseHistoryMeet';
import { StudentService } from 'src/app/services/student.service';
import { WellnessService } from 'src/app/services/wellness.service';

@Component({
  selector: 'app-history-psichology',
  templateUrl: './history-psichology.component.html',
  styleUrls: ['./history-psichology.component.css'],
})
export class HistoryPsichologyComponent implements OnInit, OnDestroy {
  formFamilyHistory: FormGroup;
  history: Boolean = false;
  isEdit: Boolean = false;
  idRecord: String = '';
  role: String = '';
  student: String = '';
  meetPsychological: MeetPsychology = null;
  loading: Boolean = false;
  loadingMeets: Boolean = false;
  meets: ResponseHistotyMett[] = [];
  subscription: Subscription = new Subscription();

  createFormFamilyHistory(): FormGroup {
    return new FormGroup({
      familyHistory: new FormControl('', Validators.required),
    });
  }

  constructor(
    private wellnessService: WellnessService,
    private studentService: StudentService,
    private store: Store<AppState>
  ) {
    this.formFamilyHistory = this.createFormFamilyHistory();
  }

  ngOnInit(): void {
    this.formFamilyHistory.get('familyHistory').disable();
    this.subscription = this.store
      .pipe(
        map(({ ui: { userActive }, auth: { user } }) => ({ user, userActive })),
        filter(({ userActive, user }) => userActive !== null && user !== null)
      )
      .subscribe(({ user, userActive }) => {
        this.role = user.rol;
        this.getMeetsPsychological(userActive.codigo, 'psicologica');
      });
  }

  async getMeetsPsychological(code: String, type: String) {
    this.loadingMeets = true;
    this.student = code;
    const res = await this.wellnessService.getMeetsHistory(code, type);
    this.meets = res;
    this.meets = this.meets.map((x) => ({
      ...x,
      dateFormat: dateHourFormat(x.meet.date, x.meet.hour),
    }));
    const familyHistory = await this.getFamilyHistory(code, type);
    if (familyHistory) {
      this.idRecord = familyHistory._id.$oid;
      this.formFamilyHistory
        .get('familyHistory')
        .setValue(familyHistory.familyHistory);
    }
    this.loadingMeets = false;
  }

  async getFamilyHistory(code: String, type: String) {
    return await this.studentService.getRecord(code, type);
  }

  async onSubmit() {
    this.loading = true;
    if (!this.formFamilyHistory.invalid) {
      let record = {
        ...this.formFamilyHistory.value,
        student: this.student,
      };
      if (this.idRecord) record = { ...record, _id: this.idRecord };
      const res = await this.studentService.saveRecord(record);
      this.idRecord = res._id;
    }
    this.isEdit = false;
    this.formFamilyHistory.get('familyHistory').disable();
    this.loading = false;
  }

  showHistory(answer: boolean = true, meetPsychological = null) {
    this.history = answer;
    this.meetPsychological = meetPsychological;
  }

  changeIsEdit(value: Boolean) {
    const input = this.formFamilyHistory.get('familyHistory');
    if (value) input.enable();
    else {
      input.disable();
      input.setValue('');
    }
    this.isEdit = value;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
