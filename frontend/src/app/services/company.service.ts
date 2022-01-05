import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private http: HttpClient) {}

  edit(companyModel: any) {
    return this.http.put(`${environment.apiUrl}company/edit`, companyModel);
  }

  create(companyModel: any) {
    return this.http.post(`${environment.apiUrl}company/create`, companyModel);
  }

  getFormData(id:string) {
    return this.http.get(`${environment.apiUrl}company/form-data`, {
      params: new HttpParams().set('id', id),
    });
  }
  getFile(id:string) {
    return this.http.get(`${environment.apiUrl}company/file`, {
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
    return this.http.get(`${environment.apiUrl}company/risk`, {
      params: new HttpParams().set('id', id),
    });
  }
  private getReputation(id: string) {
    return this.http.get(`${environment.apiUrl}company/reputation`, {
      params: new HttpParams().set('id', id),
    });
  }
  private getFinansialRisk(id: string) {
    return this.http.get(`${environment.apiUrl}company/finansial-risk`, {
      params: new HttpParams().set('id', id),
    });
  }
}
