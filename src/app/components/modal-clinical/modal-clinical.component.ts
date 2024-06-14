import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WellnessService } from 'src/app/services/wellness.service';

@Component({
  selector: 'app-modal-clinical',
  templateUrl: './modal-clinical.component.html',
  styleUrls: ['./modal-clinical.component.css'],
})
export class ModalClinicalComponent implements OnInit {
  @Output() isClosed = new EventEmitter<boolean>();
  @Input() meetClinical: any = null;

  dateFormat: Date = new Date();
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
    if (this.meetClinical) {
      console.log('ngOnInit', this.meetClinical.meetClinical.observation);
    }
  }

  ngOnInit(): void {
    this.updateObservation();
    console.log('ngOnInit', this.meetClinical.meetClinical.observation);
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
    if (this.meetClinical.meetClinical.observation) {
      this.formObservation
        .get('observation')
        .setValue(this.meetClinical.meetClinical.observation);
    }
  }

  async onSubmitObservation() {
    this.isEditObservation = false;
    this.formObservation.get('observation').disable();

    const body = {
      idClinical: this.meetClinical.meetClinical._id.$oid,
      observation: this.formObservation.get('observation').value,
      typeMeet: 'clinical',
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
