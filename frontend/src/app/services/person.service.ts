import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor(private http: HttpClient) {}

  edit(personModel: any) {
    return this.http.put(`${environment.apiUrl}person/edit`, personModel);
  }

  create(personModel: any) {
    return this.http.post(`${environment.apiUrl}person/create`, personModel);
  }
  getFormData(id) {
    return this.http.get(`${environment.apiUrl}person/form-data`, {
      params: new HttpParams().set('id', id),
    });
  }
  getFile(id) {
    return this.http.get(`${environment.apiUrl}person/file`, {
      params: new HttpParams().set('id', id),
    });
  }
  calcAnswer(id: string, funcName: string) {
    switch (funcName) {
      case 'Risk':
        return this.getRisk(id);
      case 'Reputation':
        return this.getReputation(id);
      case 'FinansialRisk':
        return this.getFinansialRisk(id);
    }
  }
  private getRisk(id: string) {
    return this.http.get(`${environment.apiUrl}person/risk`, {
      params: new HttpParams().set('id', id),
    });
  }
  private getReputation(id: string) {
    return this.http.get(`${environment.apiUrl}person/reputation`, {
      params: new HttpParams().set('id', id),
    });
  }
  private getFinansialRisk(id: string) {
    return this.http.get(`${environment.apiUrl}person/finansial-risk`, {
      params: new HttpParams().set('id', id),
    });
  }
}
