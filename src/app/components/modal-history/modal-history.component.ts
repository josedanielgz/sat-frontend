import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WellnessService } from 'src/app/services/wellness.service';

@Component({
  selector: 'app-modal-history',
  templateUrl: './modal-history.component.html',
  styleUrls: ['./modal-history.component.css'],
})
export class ModalHistoryComponent implements OnInit {
  @Output() isClosed = new EventEmitter<boolean>();
  @Input() meetPsychological: any = null;
  formObservation: FormGroup;
  show: Boolean = false;
  isEditObservation: Boolean = false;
  observation: String = '';

  createFormObservation(): FormGroup {
    return new FormGroup({
      observation: new FormControl('', Validators.required),
    });
  }
  constructor(private wellnessService: WellnessService) {
    this.formObservation = this.createFormObservation();
    this.formObservation.get('observation').disable();
  }

  ngOnInit(): void {
    this.updateObservation();
    console.log(this.meetPsychological);
  }

  onClick({ target }) {
    if (target.className === 'wrapper_alert') {
      this.close();
    }
  }

  close() {
    this.isClosed.emit(false);
  }
  updateObservation() {
    if (this.meetPsychological.meetPsychological.observation) {
      this.formObservation
        .get('observation')
        .setValue(this.meetPsychological.meetPsychological.observation);
    }
  }

  async onSubmitObservation() {
    this.isEditObservation = false;
    this.formObservation.get('observation').disable();
    const body = {
      idClinical: this.meetPsychological.meetPsychological._id.$oid,
      observation: this.formObservation.get('observation').value,
      typeMeet: 'psicologica',
    };
    await this.wellnessService.createMeetObservation(body);
  }

  showObservations() {
    this.show = !this.show;
    this.formObservation.get('observation').disable();
  }
  enableObservation() {
    this.formObservation.get('observation').enable();
    this.isEditObservation = true;
  }
}
