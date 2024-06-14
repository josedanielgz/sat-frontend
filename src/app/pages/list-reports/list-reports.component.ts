import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { showAlert } from 'src/app/helpers/alert';
import { createTableSuggestion, generatePDF } from 'src/app/helpers/pdf';
import { resetDate } from 'src/app/helpers/ui';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-list-reports',
  templateUrl: './list-reports.component.html',
  styleUrls: ['./list-reports.component.css'],
})
export class ListReportsComponent implements OnInit {
  today: Date = new Date();
  lastReport: any = null;
  loading: boolean = false;
  loadingReport: boolean = false;
  constructor(
    private location: Location,
    private reportService: ReportService
  ) {
    this.lastReportSugestion();
  }

  ngOnInit(): void {}

  goBack() {
    this.location.back();
  }

  async onSubmit({ target }) {
    this.loadingReport = true;
    const startDate = resetDate(target[0].value);
    const endDate = resetDate(target[1].value);
    const action = target[2].value;
    const data = {
      startDate,
      endDate,
      action,
    };
    const res = await this.reportService.reportSuggestion(data);
    if (!res.ok) {
      showAlert('warning', res.msg);
    } else {
      const message = `Listado de beneficios que fuerón ${
        action === 'accepted' ? 'aceptados' : 'rechazados'
      } desde la fecha ${new Date(startDate)
        .toISOString()
        .slice(0, 10)} hasta la fecha ${new Date(endDate)
        .toISOString()
        .slice(0, 10)} por vicerrectoría`;
      generatePDF(res.suggestions, message, createTableSuggestion);
    }
    this.loadingReport = false;
  }

  async lastReportSugestion() {
    this.loading = true;
    const res = await this.reportService.lastReportSuggestion();
    this.lastReport = res[0];
    this.loading = false;
  }
}
