import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AlertService } from '../../services/alert.service';
import {ArabicDatePipe} from "../../pipes/arabic-date.pipe";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";

@Component({
  selector: 'calendar',
  standalone: true,
  imports: [CommonModule, TranslateModule, ArabicDatePipe, ArabicNumbersPipe],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {
  @Output() selectedDateChanged = new EventEmitter()
  @Input() selectedDate = new Date();
  @Input() currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  monthData!: any[];
  currentDay!: number;
  disablePreviousMonth = true;
  constructor(private alert: AlertService) { }
  ngOnInit(): void {
    this.generateMonthData();
    this.currentDay = this.currentDate.getDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentDate']) {
      this.generateMonthData();
    }
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
      week.push({ day: null, isCurrentDay: false, isSelectedDay: false });
    }

    // Generate data for each day of the month
    for (let day = 1; day <= numDaysInMonth; day++) {
      const isCurrentDay = (year === currentYear && month === currentMonth && day === currentDay);
      const isSelectedDay = (this.selectedDate && year === this.selectedDate.getFullYear() && month === this.selectedDate.getMonth() && day === this.selectedDate.getDate());
      const isDisabledDay = (year === currentYear && month === currentMonth && day < currentDay);
      week.push({ day, isCurrentDay, isSelectedDay, isDisabledDay });
      // Start a new week if the current week has reached 7 days
      if (week.length === 7) {
        monthData.push(week);
        week = [];
      }
    }

    // Add empty cells for the remaining days in the last week
    while (week.length < 7) {
      week.push({ day: null, isCurrentDay: false, isSelectedDay: false });
    }

    // Add the last week to the month data
    if (week.some(day => day.day !== null)) {
      monthData.push(week);
    }

    this.monthData = monthData;
    if (this.currentDate.getFullYear() === new Date().getFullYear() && this.currentDate.getMonth() === new Date().getMonth()) {
      this.disablePreviousMonth = true;
    } else {
      this.disablePreviousMonth = false;
    }
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
  }

  selectDate(day: any) {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.selectedDate = new Date(year, month, day);
    this.selectedDateChanged.emit(new Date(year, month, day + 1));
    this.generateMonthData();
  }

  cantSelect() {
    this.alert.showAlert('cant_select_before_today', 'bg-danger')
  }
}
