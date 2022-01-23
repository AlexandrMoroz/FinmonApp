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

  typesOfBusiness: Array<String> = [
    'юридичні послуги',
    'консалтингові послуги',
    'бухгалтерські послуги',
    "послуги із заснування суб'єктів господарювання",
    'послуги із відкриття рахунку в банку від свого імені для здійснення фінансових операцій від імені клієнта',
    'азартні ігри, лотереї;',
    'послуги інкасації;',
    'діяльність, в якій високий рівень обігу готівки;',
    'торгівля нерухомістю, предметами розкоші, антикваріатом, творами мистецтва;',
    'видобуток та/або торгівля дорогоцінними рудами, металами та камінням;',
    'виробництво та/або торгівля зброєю, боєприпасами, військовою технікою та військовими машинами (її частинами);',
    "діяльність, пов'язана із виробництвом та/або торгівлею матеріалами ядерних реакторів;",
    'діяльність професійних спортивних клубів (у тому числі міжнародні спортивні організації);',
    'послуги з перестрахування;',
    'посередницькі послуги з торгівлі іноземною валютою;',
    'надання послуг, які важко документально підтвердити, що вони насправді були надані (наприклад, рекламні, маркетингові, консалтингові послуги, послуги з дослідження ринку, розроблення та обслуговування IT-рішень);',
    "інвестиційні послуги та допоміжні інвестиційні послуги [за винятком випадків, коли постачальник послуг ліцензований та є об'єктом нагляду з питань ПВК/ФТ з боку відповідного наглядового органу держави (крім держав, віднесених до переліку держав, що не виконують рекомендації FATF (чорний список), та які мають стратегічні недоліки у сфері ПВК/ФТ відповідно до заяв FATF (сірий список)];",
    'торгівля бінарними опціонами;',
    "діяльність, пов'язана з віртуальними активами (є постачальником послуг, пов'язаних з обігом віртуальних активів);",
    'діяльність неприбуткових організацій, у тому числі благодійна діяльність, діяльність релігійних організацій, політичних партій (крім ОСББ);',
    'виробництво та/або торгівля фармацевтичними продуктами або наркотичними речовинами (прекурсорами);',
    'видобуток сирої нафти, природного газу та/або виробництво нафтопродуктів;',
    'види діяльності, які передбачають отримання спеціальних дозволів на користування надрами в межах території України, її континентального шельфу та виключної (морської) економічної зони;',
    'державні закупівлі.',
  ];
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
  cleanObject(object) {
    Object.entries(object).forEach(([k, v]) => {
      if (v && typeof v === 'object') {
        this.cleanObject(v);
      }
      if (
        (v && typeof v === 'object' && !Object.keys(v).length) ||
        v === null ||
        v === undefined
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
