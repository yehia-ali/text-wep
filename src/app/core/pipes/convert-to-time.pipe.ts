import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToTime',
  standalone: true
})
export class ConvertToTimePipe implements PipeTransform {

  transform(value: number): string {
    if (value == null) {
      return '';
    }

    // Convert the decimal number to hours and minutes
    let hours:any = Math.floor(value);
    let minutes:any = Math.round((value - hours) * 60);
    if(hours < 10){
      hours = '0' + hours;
    }
    if(minutes < 10){
      minutes = '0' + minutes
    }
    // Format the result as "hours|minutes"

    return `${hours}:${minutes}`;
  }
}
