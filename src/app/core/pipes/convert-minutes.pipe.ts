import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertMinutes',
  standalone: true
})
export class ConvertMinutesPipe implements PipeTransform {
  transform(value: number, unit: string): string {
    if (unit === 'hour') {
      // Convert to hours and minutes
      const hours = Math.floor(value);
      const minutes = Math.floor((value - hours) * 60);

      return `${this.padZero(hours)}:${this.padZero(minutes)}`;
    } else if (unit === 'minutes') {
      // Convert to hours and minutes
      const hours = Math.floor(value / 60);
      const remainingMinutes = Math.floor(value % 60);

      return `${this.padZero(hours)}:${this.padZero(remainingMinutes)}`;
    } else {
      return value.toString();
    }
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
