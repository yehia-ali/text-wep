import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewAttendanceService} from "../../../../../core/services/new-attendance.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'user-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  service = inject(NewAttendanceService);
  cards: any = [];

  ngOnInit() {
    this.service.dashboard.subscribe((res: any) => {
      this.cards = [
        {name: 'present', value: res.present, filter: 2},
        {name: 'late', value: res.late, filter: 6},
        {name: 'absent', value: res.absent, filter: 1},
        {name: 'leaves', value: res.leaves, filter: 7},
        {name: 'holiday', value: res.holidays, filter: 8},
        {name: 'weekend_leave', value: res.weekEnd, filter: 9},
        // {name: 'forget_checkin', value: res.forgetCheckIn, filter: 4},
        {name: 'forget_checkout', value: res.forgetCheckOut, filter: 5},
        {name: 'total_hours', value: parseInt(res.workingHours) || 0, filter: -1},
      ]
    })
  }


  filter(value: any) {
    let removeFilter = value == this.service.filter.value;
    if (removeFilter) {
      this.service.filter.next(null)
    } else {
      this.service.filter.next(value)
    }
    this.service.hasChanged.next(true)
  }

}
