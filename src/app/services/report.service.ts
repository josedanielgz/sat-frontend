import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  URL_BACKEND = environment.url_backend;

  constructor(private http: HttpClient) {}

  reportSuggestion(data) {
    try {
      return this.http
        .post<any>(`${this.URL_BACKEND}/report/suggestion`, data)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  lastReportSuggestion() {
    try {
      return this.http
        .get<any>(`${this.URL_BACKEND}/report/suggestion/last`)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
