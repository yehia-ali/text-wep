import {Component} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
  import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {convertTimeTo24HourFormat} from '../../functions/convertTimeTo24HourFormat';
import {AppointmentService} from '../../services/appointment.service';
import {AlertService} from '../../services/alert.service';
import {ArabicDatePipe} from "../../pipes/arabic-date.pipe";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {InputLabelComponent} from "../../inputs/input-label.component";

@Component({
  selector: 'add-appointment',
  standalone: true,
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss'],
  imports: [CommonModule, MatDialogModule, TranslateModule, NgxMaterialTimepickerModule, FormsModule, MatButtonModule, ArabicNumbersPipe, ArabicDatePipe, ArabicNumbersPipe, InputLabelComponent],
  providers: [DatePipe]
})
export class AddAppointmentComponent {
  monthData!: any[];
  currentDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  selectedDays: any[] = [];
  disablePreviousMonth: boolean = true;
  from = '8:00 AM'
  to = '5:00 PM'

  constructor(private service: AppointmentService, private datePipe: DatePipe, private alert: AlertService) {
    this.generateMonthData();
  }

  generateMonthData() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();
    const monthData: any[] = [];
    let week: any[] = [];

    // Add empty cells for the days before the first day of the month
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      week.push({day: null, isCurrentDay: false, isSelectedDay: false});
    }

    // Generate data for each day of the month
    for (let day = 1; day <= numDaysInMonth; day++) {
      const isCurrentDay = (year === currentYear && month === currentMonth && day === currentDay);
      const isDisabledDay = (year === currentYear && month === currentMonth && day < currentDay);
      const isSelectedDay = this.selectedDays.includes(new Date(year, month, day).toString());

      week.push({day, isCurrentDay, isSelectedDay, isDisabledDay});
      // Start a new week if the current week has reached 7 days
      if (week.length === 7) {
        monthData.push(week);
        week = [];
      }
    }

    // Add empty cells for the remaining days in the last week
    while (week.length < 7) {
      week.push({day: null, isCurrentDay: false, isSelectedDay: false});
    }

    // Add the last week to the month data
    if (week.some(day => day.day !== null)) {
      monthData.push(week);
    }

    this.monthData = monthData;
  }

  nextMonth() {
    this.disablePreviousMonth = false;
    this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() + 1));
    this.generateMonthData();
  }

  previousMonth() {
    if (this.currentDate.toString() != new Date(new Date().getFullYear(), new Date().getMonth(), 1).toString()) {
      this.currentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() - 1));
      this.generateMonthData();
    }

    if (this.currentDate.toString() == new Date(new Date().getFullYear(), new Date().getMonth(), 1).toString()) {
      this.disablePreviousMonth = true;
    }
  }

  selectDate(day: any) {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    day.isSelectedDay = !day.isSelectedDay;
    if (!day.isSelectedDay) {
      this.selectedDays = this.selectedDays.filter((date) => date !== new Date(year, month, day.day).toString());
    } else {
      this.selectedDays.push(new Date(year, month, day.day).toString());
    }
  }

  cantSelect() {
    this.alert.showAlert('cant_select_before_today', 'bg-danger')
  }

  submit() {
    const startTime = convertTimeTo24HourFormat(this.from);
    const endTime = convertTimeTo24HourFormat(this.to);
    let utcTime = new Date().getTimezoneOffset() / 60;

    const dates = this.selectedDays.map((date) => {
      let startDate = this.datePipe.transform(new Date(date), 'yyyy-MM-dd') + 'T' + startTime + ':00Z';
      let endDate = this.datePipe.transform(new Date(date), 'yyyy-MM-dd') + 'T' + endTime + ':00Z';
      let data = {
        startDateTime: new Date(new Date(startDate).setHours(new Date(startDate).getHours() + utcTime)),
        endDateTime: new Date(new Date(endDate).setHours(new Date(endDate).getHours() + utcTime)),
      }
      return data;
    });
    this.service.addMyAppointments(dates).subscribe();
  }
}
