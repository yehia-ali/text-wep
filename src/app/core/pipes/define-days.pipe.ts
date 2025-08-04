import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'defineDays',
  standalone: true
})
export class DefineDaysPipe implements PipeTransform {
  lang = localStorage.getItem('language');

  transform(n: any) {
    return new Intl.PluralRules('ar-EG').select(n);
  }
}
