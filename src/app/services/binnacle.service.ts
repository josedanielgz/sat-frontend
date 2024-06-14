import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Binnacle, ResponseBinnacle } from '../model/administrative';

@Injectable({
  providedIn: 'root',
})
export class BinnacleService {
  endpoint: String = environment.url_backend;

  constructor(private http: HttpClient) {}

  toWriter(binnacle: Binnacle) {
    try {
      return this.http
        .post<ResponseBinnacle>(this.endpoint + '/binnacle/', binnacle)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getBinnacle(code: String) {
    try {
      return this.http
        .get<Binnacle[]>(this.endpoint + '/binnacle/' + code)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
