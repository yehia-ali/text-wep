import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'arabicDate',
  standalone: true
})
export class ArabicDatePipe implements PipeTransform {
  lang = localStorage.getItem('language');
  utcOffset: any = new Date().getTimezoneOffset();

  transform(n: any, type: any = '', utc: boolean = true) {
    if (!utc) {
      this.utcOffset = null
    }
    const date = new Date(new Date(n).getTime()).setMinutes(new Date(n).getMinutes() - this.utcOffset) || new Date();
    let options: any;
    if (type == 'long') {
      options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour12: true
      }
    } else if (type == 'weekDay') {
      options = {
        weekday: "short",
      }
    } else if (type == 'dayNumber') {
      options = {
        day: "numeric",
      }
    } else if (type == 'short') {
      options = {
        year: "numeric",
        month: "long",
      }
    } else if (type == 'withTime') {
      options = {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "numeric",
        hour12: true
      }
    } else if (type == 'time') {
      options = {
        hour: "2-digit",
        minute: "numeric",
        hour12: true
      }
    } else if (type == 'typicalDate') {
      options = {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }
    } else if (type == 'navbarCard') {
      options = {
        day: "numeric",
        month: "long",
        weekday: "short",
      }
    }else if (type == 'month') {
      options = {
        day: "numeric",
        month: "long",
      }
    } else {
      options = {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour12: true
      }
    }

    if (this.lang == 'ar') {
      return new Intl.DateTimeFormat('ar-Eg', options).format(date);
    } else {
      return new Intl.DateTimeFormat('en-GB', options).format(date);
    }
  }
}
