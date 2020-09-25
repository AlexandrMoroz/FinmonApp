import { Injectable } from '@angular/core';
import { Person } from '../shared/models';
import * as faker from 'faker';
import { fake } from 'faker';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  constructor(private http: HttpClient) {}

  edit(personModel: any) {
    console.log('do edit request');
    return this.http.post(`${environment.apiUrl}/api/person/edit`, personModel);
  }

  create(personModel: any) {
    console.log('do create request');
    return this.http.post(
      `${environment.apiUrl}/api/person/create`,
      personModel
    );
  }

  getFormData(id) {
    console.log('do get by id request');
    return this.http.get(`${environment.apiUrl}/api/person/form-data`, {
      params: new HttpParams().set('id', id),
    });
  }
}
