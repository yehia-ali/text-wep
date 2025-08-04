import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import {ArabicDatePipe} from "../../pipes/arabic-date.pipe";

@Component({
  selector: 'week-view',
  standalone: true,
  imports: [CommonModule, ArabicDatePipe],
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss']
})
export class WeekViewComponent {
  @Output() selectedDateChanged = new EventEmitter();
  today = new Date().getTime();
  selectedDate = new Date();
  weekDays: Date[] = [];
  currentWeekStart!: Date;
  currentMonth!: string;
  currentYear!: number;
  isPreviousButtonDisabled = true;
  dir = document.dir;

  constructor(private alert: AlertService) { }

  ngOnInit(): void {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    this.currentWeekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDay));
    this.generateWeekDays();
    this.updateCurrentMonth();
  }

  generateWeekDays() {
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(this.currentWeekStart);
      day.setDate(this.currentWeekStart.getDate() + i);
      this.weekDays.push(day);
    }
  }


  goToPreviousWeek() {
    const today = new Date();
    const previousWeekStart = new Date(this.currentWeekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);

    if (today < this.currentWeekStart) {
      this.currentWeekStart = previousWeekStart;
      this.generateWeekDays();
      this.updateCurrentMonth();
    }

    if (today > this.currentWeekStart) {
      this.isPreviousButtonDisabled = true;
    }
  }

  goToNextWeek() {
    this.isPreviousButtonDisabled = false;
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateWeekDays();
    this.updateCurrentMonth();
  }

  updateCurrentMonth() {
    const currentMonthIndex = this.weekDays[0].getMonth();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.currentMonth = months[currentMonthIndex];
    this.currentYear = this.weekDays[0].getFullYear();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.selectedDateChanged.emit(date);
  }

  cantSelect() {
    this.alert.showAlert('cant_select_before_today', 'bg-danger')
  }
}
