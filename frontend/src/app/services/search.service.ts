import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  search(serchController, searchText) {
    return this.http.get(`${environment.apiUrl}${serchController}/search`, {
      params: new HttpParams().set('searchText', searchText),
    });
  }
  externalBaseSearch(type, searchText) {
    return this.http
      .get(`${environment.apiUrl}externalbase/search`, {
        params: new HttpParams()
          .set('searchText', searchText)
          .set('type', type),
      })
      .pipe(
        map((data) => {
          let terrorist = [];
          let sanction = [];
          if (data['result']['terrorist'].length != 0) {
            terrorist = data['result']['terrorist'].map((item) => {
              return `Ім'я оригіналу: ${item.name}`;
            });
          }
          if (data['result']['sanction'].length != 0) {
            sanction = data['result']['sanction'].map((item) => {
              let name_ukr =
                item.name_ukr == null
                  ? ''
                  : `Ім'я українською: ${item.name_ukr}`;
              let name_original =
                item.name_original == null
                  ? ''
                  : `Ім'я оригіналу: ${
                      item.name_original == null ? '' : item.name_original
                    }`;
              let odrn_edrpou =
                item.odrn_edrpou == null
                  ? ''
                  : ` ЄГРПОУ: ${item.odrn_edrpou}`;
              let IPN = item.ipn == null ? '' : `РНОКПП: ${item.ipn}`;
              return `${[name_ukr, name_original, odrn_edrpou, IPN].filter(
                (a) => a
              ).join('')}`;
            });
          }
          return { sanction, terrorist };
        })
      );
  }
}
