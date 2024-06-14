import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import {
  StatisticsResponse,
  StatisticsRisk,
  StudentsInRiskResponse,
} from '../model/risk';

@Injectable({
  providedIn: 'root',
})
export class RiskService {
  URL_BACKEND = environment.url_backend;

  constructor(private http: HttpClient) {}

  calculateTotalStatistics(statistics: StatisticsRisk) {
    try {
      return this.http
        .post<StatisticsResponse>(
          this.URL_BACKEND + '/risk/calulateStatistics',
          statistics
        )
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getStudentsInRisk(statistics: StatisticsRisk) {
    try {
      return this.http
        .post<StudentsInRiskResponse>(
          this.URL_BACKEND + '/risk/calulateStatistics',
          statistics
        )
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
