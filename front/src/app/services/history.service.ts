import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HistoryModel } from '../shared/models';
import { HelperService } from './helpers.service';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  Translation: any;
  OPERATIONS = {
    add: 'Додано',
    remove: 'Видаленно',
    replace: 'Заменінно',
    move: 'Переміщено',
  };

  constructor(private http: HttpClient, private helpers: HelperService) {}

  getHistory(obj, id) {
    console.log('do history request');
    return this.http
      .get(`${environment.apiUrl}/api/history/${obj.service}`, {
        params: new HttpParams().set('id', id),
      })
      .pipe(
        map((data) => {
          console.log(data);
          let temp = data['result'].map((item) => {
            return `
             <i class="round"></i>
             <h5> Зміна створенна: ${new Date(item.createdAt).toLocaleString()}</h5> 
             <h5> Користувачем: ${item.user} </h5>
             ${item.diff.map((i) => {
               return this.mapHistoty(i);
             }).join('')}
            `;
          });
          console.log(temp)
          return temp.join('');
        })
      );
  }

  getXLSXFile(obj, id) {
    console.log('do history XLSX request');
    return this.http.get(
      `${environment.apiUrl}/api/history/${obj.file_service}`,
      {
        params: new HttpParams().set('id', id),
      }
    );
  }

  mapHistoty(diff) {
    if (diff.op == this.OPERATIONS.replace) {
      return `<li> ${diff.op}, в ${diff.path} з ${this.mapDiffValue(
        diff.was
      )} на ${this.mapDiffValue(diff.became)}</li>`;
    } else {
      return `<li> ${diff.op}, в ${diff.path} значення ${this.mapDiffValue(
        diff.value
      )} </li>`;
    }
  }

  mapDiffValue(value) {
    if (typeof value === 'object' && !Array.isArray(value)) {
      let temp = [];
      Object.entries(value).forEach(([key, val]) => {
        if (typeof val === 'object' && !Array.isArray(val)) {
          temp.push(`<li> ${key}, <ul>${this.mapDiffValue(val)}</ul></li>`);
        } else {
          temp.push(`<li>${key},  ${val}<li> `);
        }
      });
      return `${temp.join('')}`;
    } else if (Array.isArray(value)) {
      return value.map((item) => {
        return this.mapDiffValue(item);
      });
    } else {
      return `${value}`;
    }
  }
}
