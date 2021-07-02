import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  search(serchController, searchText) {
    
    return this.http.get(
      `${environment.apiUrl}${serchController}/search`,
      {
        params: new HttpParams().set('searchText', searchText),
      }
    );
  }
}
