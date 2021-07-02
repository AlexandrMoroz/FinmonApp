import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${environment.apiUrl}user/all`);
  }

  createUser(user: any) {
    
    return this.http.post(`${environment.apiUrl}user/create`, { ...user });
  }

  editUser(user: any) {
    
    return this.http.put(`${environment.apiUrl}user/edit`, { ...user });
  }
}
