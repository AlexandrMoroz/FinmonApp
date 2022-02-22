import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormlyConfig } from '@ngx-formly/core';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(
    private http: HttpClient,
    private config: FormlyConfig,
    private flashMessagesService: FlashMessagesService
  ) {}
  countryHelper = 'countries';

  getCountries() {
    if (!localStorage.getItem(this.countryHelper)) {
      return this.http
        .get(`${environment.apiUrl}helper`, {
          params: new HttpParams().set('name', this.countryHelper),
        })
        .pipe(
          map((data) => {
            let countries = data['result'].map((item, index) => {
              return { label: item };
            });
            localStorage.setItem(this.countryHelper, JSON.stringify(countries));
            return countries;
          })
        );
    } else {
      return of(JSON.parse(localStorage.getItem(this.countryHelper)));
    }
  }
  getAutocompleteDataService(name: string) {
    if (name === 'typesOfBusiness') return this.getTypeOfBusiness();
    if (name === 'independentTypesOfBusiness')
      return this.getIndependentTypeOfBusiness();
  }
  getTranslate(name) {
    if (!localStorage.getItem(name)) {
      return this.http
        .get(`${environment.apiUrl}helper`, {
          params: new HttpParams().set('name', name),
        })
        .pipe(
          map((data) => {
            localStorage.setItem(name, JSON.stringify(data['result']));
            return data['result'];
          })
        );
    } else {
      return of(JSON.parse(localStorage.getItem(name)));
    }
  }
  getTypeOfBusiness() {
    if (!localStorage.getItem('TofB')) {
      return this.http
        .get(`${environment.apiUrl}helper`, {
          params: new HttpParams().set('name', 'typesOfBusiness'),
        })
        .pipe(
          map((data) => {
            localStorage.setItem('TofB', JSON.stringify(data['result']));
            return data['result'];
          })
        );
    } else {
      return of(JSON.parse(localStorage.getItem('TofB')));
    }
  }
  getIndependentTypeOfBusiness() {
    if (!localStorage.getItem('ITofB')) {
      return this.http
        .get(`${environment.apiUrl}helper`, {
          params: new HttpParams().set('name', 'independentTypesOfBusiness'),
        })
        .pipe(
          map((data) => {
            localStorage.setItem('ITofB', JSON.stringify(data['result']));
            return data['result'];
          })
        );
    } else {
      return of(JSON.parse(localStorage.getItem('ITofB')));
    }
  }
  getAllClients() {
    return this.http.get(`${environment.apiUrl}helper/allclients`);
  }
  cleanObject(object) {
    Object.entries(object).forEach(([k, v]) => {
      if (v && typeof v === 'object') {
        this.cleanObject(v);
      }
      if (
        (v && typeof v === 'object' && !Object.keys(v).length) ||
        v === null ||
        v === undefined ||
        v === ''
      ) {
        if (Array.isArray(object)) {
          object.splice(k as any, 1);
        } else {
          delete object[k];
        }
      }
    });
    return object;
  }

  isObject(x: any) {
    return x != null && typeof x === 'object';
  }
  getErrorMessage(field) {
    const fieldForm = field.formControl;
    for (const error in fieldForm.errors) {
      if (fieldForm.errors.hasOwnProperty(error)) {
        let message = this.config.getValidatorMessage(error);

        if (this.isObject(fieldForm.errors[error])) {
          if (fieldForm.errors[error].errorPath) {
            return;
          }
          if (fieldForm.errors[error].message) {
            message = fieldForm.errors[error].message;
          }
        }

        if (field.validation?.messages?.[error]) {
          message = field.validation.messages[error];
        }

        if (field.validators?.[error]?.message) {
          message = field.validators[error].message;
        }

        if (field.asyncValidators?.[error]?.message) {
          message = field.asyncValidators[error].message;
        }
        if (typeof message === 'function') {
          return message(fieldForm.errors[error], field);
        }
        return message;
      }
    }
  }
  ShowError(data) {
    //console.error(data.splite("</br>"))
    this.flashMessagesService.show(`Помилка ${data.toString()}`, {
      cssClass: 'alert-danger',
      timeout: 5000,
    });
  }
  ShowSuccess(message) {
    this.flashMessagesService.show(message, {
      cssClass: 'alert-success',
      timeout: 5000,
    });
  }
}
