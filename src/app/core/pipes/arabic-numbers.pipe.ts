import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'arabicNumbers',
  standalone: true
})
export class ArabicNumbersPipe implements PipeTransform {
  lang = localStorage.getItem('language');

  transform(n: number): string {
    if (n === null || n === undefined) {
      return '';
    }
    const isInteger = Number.isInteger(n);
    if (this.lang === 'ar') {
      const formatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: isInteger ? 0 : 2,
        maximumFractionDigits: 2
      }).format(n);
      return formatted.replace(/\d/g, (digit:any) => '٠١٢٣٤٥٦٧٨٩'[digit]);
    } else {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: isInteger ? 0 : 2,
        maximumFractionDigits: 2
      }).format(n);
    }
  }


}
