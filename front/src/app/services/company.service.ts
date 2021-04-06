import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
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
  getFile(id) {
    console.log('do get file request');
    return this.http.get(`${environment.apiUrl}/api/person/file`, {
      params: new HttpParams().set('id', id),
    });
  }
}
