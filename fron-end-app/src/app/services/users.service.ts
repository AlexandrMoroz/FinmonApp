import { Injectable } from '@angular/core';
import { UserModel, Role } from '../shared/models';
import * as faker from 'faker';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(
      `${environment.apiUrl}/api/users/allusers`
    );
  }

  createUser(user: any) {
    console.log(`user create start ${(user.username, user.password)}`);
    const body = { ...user };
    return this.http.post(`${environment.apiUrl}/api/users/create-user`, body);
  }

  editUser(user: any) {
    console.log(`user edit start ${(user.username, user.password)}`);
    const body = { ...user };
    return this.http.post(`${environment.apiUrl}/api/users/edit-user`, body);
  }
}
