import { Location } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { User } from '../model/auth';
import {
  Meet,
  MeetAsistenResponse,
  MeetPaginateResponse,
  MeetResponse,
} from '../model/meet';
import {
  BodyMeetActivateRol,
  ResponseHistotyMett,
  ResponseMeetActivateRol,
} from '../model/responseHistoryMeet';
import { Postulation, Profit } from '../model/risk';
import {
  ResponseSuggestion,
  Suggestion,
  ResponseSuggestionPaginate,
} from '../model/suggestion';
import { ResponseFacultie } from '../model/wellness';

@Injectable({
  providedIn: 'root',
})
export class WellnessService {
  URL_BACKEND = environment.url_backend;

  constructor(private http: HttpClient, private location: Location) {}

  getFaculties() {
    try {
      return this.http
        .get<ResponseFacultie>(`${this.URL_BACKEND}/wellness/faculties`)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  createUser(user: User) {
    try {
      return this.http
        .post<Boolean>(`${this.URL_BACKEND}/auth/administrative/register`, user)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async validateProgram(nameProgram: String) {
    try {
      const res = await this.http
        .get<boolean>(
          `${this.URL_BACKEND}/wellness/semester/program/${nameProgram}`
        )
        .toPromise();
      if (!res) this.location.back();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  createMeet(meet: Meet) {
    try {
      return this.http
        .post<MeetResponse>(`${this.URL_BACKEND}/meet/`, meet)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  createMeetStudent(meet: Meet) {
    try {
      return this.http
        .post<MeetResponse>(`${this.URL_BACKEND}/meet/student`, meet)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getMeetOfStudent(code: String) {
    try {
      return this.http
        .get<Meet>(`${this.URL_BACKEND}/meet/${code}`)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  acceptMeet(id: String, accept: Boolean, data: String) {
    try {
      const body = accept ? { accept, hour: data } : { accept, reason: data };
      return this.http
        .put<MeetAsistenResponse>(`${this.URL_BACKEND}/meet/${id}`, body)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  attendanceMeet(id: String, attendance: Boolean, student: String) {
    try {
      return this.http
        .put<MeetAsistenResponse>(`${this.URL_BACKEND}/meet/attendance/${id}`, {
          attendance,
          student,
        })
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getMeetsStudent(code: String) {
    try {
      return await this.http
        .get<Meet[]>(`${this.URL_BACKEND}/meet/meets/${code}`)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getMeetActiveWithRole(body: BodyMeetActivateRol) {
    try {
      return await this.http
        .post<ResponseMeetActivateRol>(
          `${this.URL_BACKEND}/meet/meets/role`,
          body
        )
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createMeetHistory(body: any) {
    try {
      return await this.http
        .post<Boolean>(`${this.URL_BACKEND}/meet/meets/history`, body)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async createMeetObservation(body: any) {
    try {
      return await this.http
        .post<Boolean>(`${this.URL_BACKEND}/meet/meets/observation`, body)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getMeetsHistory(code: String, type: String) {
    try {
      return await this.http
        .get<ResponseHistotyMett[]>(
          `${this.URL_BACKEND}/meet/meets/history/${code}/${type}`
        )
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  postulateMeet(page: string, state: string, date: string) {
    try {
      const params = new HttpParams()
        .set('page', page)
        .set('state', state)
        .set('date', date);
      return this.http
        .get<MeetPaginateResponse>(`${this.URL_BACKEND}/meet/paginate`, {
          params,
        })
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  paginateSuggestion(page, perPage) {
    try {
      const params = new HttpParams().set('page', page).set('perPage', perPage);
      return this.http
        .get<ResponseSuggestionPaginate>(
          `${this.URL_BACKEND}/suggestion/paginate`,
          { params }
        )
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  filterSuggestion(page, perPage, body) {
    try {
      const params = new HttpParams().set('page', page).set('perPage', perPage);
      return this.http
        .post<ResponseSuggestionPaginate>(
          `${this.URL_BACKEND}/suggestion/filter`,
          body,
          { params }
        )
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getProfits() {
    try {
      return this.http
        .get<Profit[]>(`${this.URL_BACKEND}/wellness/profits`)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  createSuggestion(suggestion: Suggestion) {
    try {
      return this.http
        .post<Suggestion>(`${this.URL_BACKEND}/suggestion/`, suggestion)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  reponseSuggestion(data) {
    try {
      return this.http
        .put<ResponseSuggestion>(
          `${this.URL_BACKEND}/suggestion/response`,
          data
        )
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getPostulationById(id) {
    try {
      return this.http
        .get<Postulation>(`${this.URL_BACKEND}/wellness/postulation/${id}`)
        .toPromise();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
