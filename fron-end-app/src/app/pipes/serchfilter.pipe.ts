import { Pipe, PipeTransform } from '@angular/core';  
@Pipe({
  name: 'searchFilter'
})
export class SearchPipe implements PipeTransform {
  transform(list: any[], filterText: string): any {
    if(!list){
      return [];
    }
    if(!filterText){
      return list;
    }
    
    let arrByName = list.filter(item => item.name.indexOf(filterText) !== -1);
    let arrByFamily = list.filter(item => item.family.indexOf(filterText) !== -1);
    let arrBySurname = list.filter(item => item.surname.indexOf(filterText) !== -1);
    let arrByInn = list.filter(item => item.INN.toString().indexOf(filterText) !== -1);
    let arr = [...arrByName,...arrByFamily,...arrBySurname,...arrByInn];
    return arr ? arr : [];
  }
}