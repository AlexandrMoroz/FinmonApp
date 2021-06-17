import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthService,
    private flashMessagesService: FlashMessagesService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status == 400 && !err.error?.validation) {
          let msg = err.error.error
            .map((item) => {
              return item.msg;
            })
            .join('<br/>');
          this.flashMessagesService.show(`Ошибка: <br/> ${msg}`, {
            cssClass: 'alert-danger',
            timeout: 5000,
          });
        }
        if ([401, 403].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          this.authenticationService.logout();
          if (location.pathname != '/auth/login') {
            location.reload();
          }
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
