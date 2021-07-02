import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserModel, Role } from '../shared/models';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<UserModel>;
  public currentUser: Observable<UserModel>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserModel>(
      JSON.parse(localStorage.getItem('_cu'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get isAdmin() {
    return this.currentUserValue && this.currentUserValue.role === Role.Admin;
  }
  public get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }
  isLogged() {
    let user = JSON.parse(localStorage.getItem('_cu'));
    return user && user.token;
  }
  login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}user/login`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('_cu', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('_cu');
    this.currentUserSubject.next(null);
  }
}
