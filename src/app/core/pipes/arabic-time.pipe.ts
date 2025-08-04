import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arabicTime',
  standalone: true
})
export class ArabicTimePipe implements PipeTransform {
  lang = localStorage.getItem('language');
  utcOffset: any = new Date().getTimezoneOffset();

  transform(n: any, utc = true) {
    if (!utc) {
      this.utcOffset = null
    }

    const date = new Date(new Date(n).getTime()).setMinutes(new Date(n).getMinutes() - this.utcOffset) || new Date();
    let options: any;
    options = {
      hour: 'numeric', minute: 'numeric',
      hour12: true
    }


    if (this.lang == 'ar') {
      return new Intl.DateTimeFormat('ar-Eg', options).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }
  }
}
