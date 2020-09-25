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

  constructor(private http: HttpClient, private helpers: HelperService) {}

  getHistory(obj, id) {
    console.log('do history request');
    return this.http
      .get(`${environment.apiUrl}/api/history/${obj.service}`, {
        params: new HttpParams().set('id', id),
      })
      .pipe(
        tap((ev) => {
          this.helpers
            .getTranslateByName(`${obj.translate}Translation`)
            .subscribe(
              (data: any) => {
                this.Translation = data;
              },
              (error) => {
                console.log(error);
              }
            );
        }),
        map((item) => {
          item['result'] = this.mapHistoryDiff(item['result']);
          return item;
        })
      );
  }

  private mapHistoryDiff(history) {
    //{ name:"Beneficiaries" }
    let allHistoryAsHtml = [];
    //diff
    for (let key in history) {
      let tempHistory = history[key].diff;
      let arr = [];
      //diff objects
      for (let key2 in tempHistory) {
        let property = '';
        //Get only object who has _t meens it was created if key 0 or deleted if key _0
        if (tempHistory[key2]._t) {
          //Get only content with out _t:'a'
          let onlyContent = Object.entries(tempHistory[key2])
            .filter(([key, value]) => !key.includes('_t'))
            .map(([key, value]) => {
              return { key, value };
            });

          let fields = [];
          //get only deleted objects
          console.log(onlyContent)
          onlyContent
            .filter(({ key, value }) => key.includes('_'))
            .forEach(({ key, value }) => {
              //delete object is [ oldValue5, 0, 0 ] delete two 0
              let temp = (value as Array<any>).filter((j) => j != 0);
              //cheack is first value is object or string
              if (this.isObject(temp[0]) && !Array.isArray(temp[0])) {
              
                //split deleted object to key value
                temp = Object.entries(temp[0]).map(([key, value]) => {
                  return ` ${this.Translate(key)}, ${value} `;
                });

                fields.push(`<li>Удалено значение: ${temp} </li>`);
              } else {
                fields.push(`<li>Удалено значение: ${temp[0]} </li>`);
              }
            });
          //get added objects
          onlyContent
            .filter(({ key, value }) => !key.includes('_'))
            .forEach(({ key, value }) => {
              if (Array.isArray(value)) {
                let temp = (value as Array<any>).filter((j) => j != 0);

                if (typeof temp[0] != 'string') {
                  //split deleted object to key value
                  temp = Object.entries(temp[0]).map(([key, value]) => {
                    return ` ${this.Translate(key)}, ${value} `;
                  });

                  fields.push(`<li>Добавлено значение: ${temp} </li>`);
                } else {
                  fields.push(`<li>Добавлено значение: ${temp[0]} </li>`);
                }
              } else {
                let temp = Object.entries(value).map(([key, value]) => {
                  //if value is an object like representetive or benefisiar. editing value of it may contains tree of objects
                  if (this.isObject(value) && !Array.isArray(value)) {
                    // console.log(value);
                    // 2 if object is edited
                   
                    let nestedValues = Object.entries(value).map(
                      ([key, value]) => {
                        if ((value as Array<any>).length == 2) {
                          return `<li> Изменено в: ${this.Translate(key)}, с:  ${value[0]} на: ${value[1]}</li>`;
                        } else {
                          return `<li> Добавлено в: ${this.Translate(key)} значение:${value[0]} </li>`;
                        }
                      }
                    );
                    return `<li>Изменено в: ${this.Translate(
                      key
                    )}, <ul> ${nestedValues}</ul> </li>`;
                  } else {
                    return `<li>Изменено в: ${this.Translate(key)}, с: ${
                      value[0]
                    } на: ${value[1]}</li>`;
                  }
                });

                fields.push(`${temp.join('')}`);
              }
            });
          property = `<li>Изменено в: ${this.Translate(key2)} <ul>${fields.join(
            ''
          )}</ul></li>`;
          arr.push(property);
        }
        //Get else objects that was edited it
        else {
          let temp = tempHistory[key2];
          //console.log(tempHistory[key2]);
          //lenght = 2 if object was edited
          if (temp.length == 2) {
            property = `<li>Изменено в: ${this.Translate(key2)} с: ${
              temp[0]
            } на: ${temp[1]} </li>`;
            arr.push(property);
          }
          // if temp[1] and temp[2] = 0 meens object was deleted
          else if (temp[1] == 0 && temp[2] == 0) {
            arr.push(
              this.getProperties(
                temp[0],
                this.Translate(key2),
                'Удаленно'
              ).join('')
            );
          } //else it was added
          else {
            //get all added values
            arr.push(
              this.getProperties(
                temp[0],
                this.Translate(key2),
                'Добавленно'
              ).join('')
            );
          }
        }
      }
      let historyByDay = `<li>   <i class="round"></i><h4> Изменена: ${
        history[key].user
      } Дата: ${this.toLocalDate(history[key].createdAt)}</h4><ul> ${arr.join(
        ''
      )}</ul></li>`;
      allHistoryAsHtml.push(historyByDay);
    }
    return allHistoryAsHtml;
  }
  private Translate(key) {
    return this.Translation[key] ?? key;
  }

  private getProperties(arr, propetyName, procedureName) {
    let result = [];
    arr.forEach((element, index) => {
      //get key value of all object
      let keyValue = Object.entries(element).map(([key, value]) => {
        //if value is object we need to get key and value
        if (this.isObject(value) && !Array.isArray(value)) {
          let nestedValues = Object.entries(value).map(([key, value]) => {
            return `<li> ${procedureName} в: ${this.Translate(
              key
            )} значение: ${value}</li>`;
          });
          return `<li>${procedureName} в: ${this.Translate(
            key
          )} <ul> ${nestedValues.join('')}</ul> </li>`;
        } else {
          return `<li> ${procedureName} в: ${this.Translate(
            key
          )} значение: ${value} </li>`;
        }
      });
      let property = `<li> ${procedureName} в: ${propetyName} ${
        index + 1
      } <ul> ${keyValue.join('')}</ul> </li>`;
      result.push(property);
    });
    return result;
  }

  private toLocalDate(arg) {
    return new Date(arg).toLocaleString();
  }
  private isObject(obj) {
    var type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
  }
}
