import { Injectable } from "@angular/core";
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class FormService {
  constructor(private http: HttpClient) {}

  getFormByName(name) {
    if (!localStorage.getItem(name)) {
           return this.http.get(
        `${environment.apiUrl}/api/form/by-name`,
        {
          params: new HttpParams().set('name', name),
        }
      ).pipe(map(data=>{
          localStorage.setItem(name, JSON.stringify({result:data['result'],expiresIn: 28800}));
          return data['result'];
      }))
        
    } else {
      return of(JSON.parse(localStorage.getItem(name)).result);
    }

  }
}
