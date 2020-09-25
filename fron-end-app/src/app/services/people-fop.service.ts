import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PeopleFopService {
  constructor(private http: HttpClient) {}
  edit(personModel: any) {
    console.log('do edit request');
    return this.http.post(
      `${environment.apiUrl}/api/fop/edit`,
      personModel
    );
  }
  create(personModel: any) {
    console.log('do create request');
    return this.http.post(
      `${environment.apiUrl}/api/fop/create`,
      personModel
    );
  }
  getAll() {
    console.log('do get all request');
    return this.http.get(`${environment.apiUrl}/api/fop/all`);
  }
  getFormData(id) {
    console.log('do get by id request');
    return this.http.get(
      `${environment.apiUrl}/api/fop/form-data`,
      {
        params: new HttpParams().set('id', id),
      }
    );
  }
}
