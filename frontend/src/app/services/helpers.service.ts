import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(private http: HttpClient) {}
  countryHelper = 'countries';
  personTranslate = 'peopleHistoryTranslation';
  getCountries(){
    if (!localStorage.getItem(this.countryHelper)) {
      return this.http
        .get(`${environment.apiUrl}/api/helper/by-name`, {
          params: new HttpParams().set('name', this.countryHelper),
        })
        .pipe(
          map((data) => {
            let countries = data['result'].content.map((item, index) => {
              return { label: item.name };
            });
            localStorage.setItem(this.countryHelper, JSON.stringify(countries));
            return countries;
          })
        );
    } else {
      return of(JSON.parse(localStorage.getItem(this.countryHelper)));
    }
  }

  getTranslate(name) {
    if (!localStorage.getItem(name)) {
      return this.http
        .get(`${environment.apiUrl}/api/helper/by-name`, {
          params: new HttpParams().set('name', name),
        })
        .pipe(
          map((data) => {
            localStorage.setItem(name, JSON.stringify(data['result'].data));
            return data['result'].data;
          })
        );
    } else {
      return of(JSON.parse(localStorage.getItem(name)));
    }
  }
}
