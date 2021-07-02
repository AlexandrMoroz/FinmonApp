import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  edit(companyModel: any) {
    
    return this.http.put(`${environment.apiUrl}company/edit`, companyModel);
  }

  create(companyModel: any) {
    
    return this.http.post(
      `${environment.apiUrl}company/create`,
      companyModel
    );
  }

  getFormData(id) {
    
    return this.http.get(`${environment.apiUrl}company/form-data`, {
      params: new HttpParams().set('id', id),
    });
  }
  getFile(id) {
    
    return this.http.get(`${environment.apiUrl}company/file`, {
      params: new HttpParams().set('id', id),
    });
  }
}
