import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { merge, Subscription } from 'rxjs';
import { filter, map, pluck, take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducers';
import { getValueOfLocalStorage } from 'src/app/helpers/localStorage';
import { createTable, generatePDF } from 'src/app/helpers/pdf';
import { capitalizeText } from 'src/app/helpers/ui';
import { User } from 'src/app/model/auth';
import { StatisticsRisk } from 'src/app/model/risk';

@Component({
  selector: 'app-download-pdf',
  templateUrl: './download-pdf.component.html',
  styleUrls: ['./download-pdf.component.css'],
})
export class DownloadPdfComponent implements OnInit, OnDestroy {
  @Input() students: User[];
  subscription: Subscription = new Subscription();
  text: String = '';

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = merge(
      this.route.params.pipe(
        pluck('programa'),
        filter((program) => program),
        map((program) => `el programa de ${program.toUpperCase()}`)
      ),
      this.store.select('course').pipe(
        pluck('active'),
        filter((course) => course !== null),
        map(
          (course) =>
            `el curso de ${course.materia.nombre.toUpperCase()} - ${
              course.materia.codigo
            }${course.grupo}`
        )
      )
    )
      .pipe(take(1))
      .subscribe((cad) => {
        this.text = `Listado de estudiantes registrados actualmente en ${cad} con su respectivo nivel de riesgo de deserción detectado por SAT (Sistema de alertas tempranas) de la UFPS`;
      });
  }

  download() {
    if (this.text) {
      generatePDF(this.students, this.text, createTable);
    } else {
      const statisticsRisk: StatisticsRisk =
        getValueOfLocalStorage('statisticsRisk');
      const risk =
        statisticsRisk.risk === 'critico'
          ? 1
          : statisticsRisk.risk === 'moderado'
          ? 2
          : 3;
      const students = this.students.map((student) => ({
        ...student,
        riesgo: risk,
      }));
      generatePDF(
        students,
        `Listado de estudiantes detectado por SAT (Sistema de alertas tempranas) de la UFPS en Riesgo ${capitalizeText(
          statisticsRisk.risk
        )}`,
        createTable
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
