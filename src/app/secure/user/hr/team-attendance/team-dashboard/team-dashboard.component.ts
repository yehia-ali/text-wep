import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {TeamAttendanceService} from "../../../../../core/services/team-attendance.service";
import { LoadingComponent } from '../../../../../core/components/loading.component';

@Component({
  selector: 'team-dashboard',
  standalone: true,
  imports: [CommonModule, TranslateModule, LoadingComponent],
  templateUrl: './team-dashboard.component.html',
  styleUrls: ['./team-dashboard.component.scss']
})
export class TeamDashboardComponent implements OnInit{
  service = inject(TeamAttendanceService);
  cards: any = [];
  ngOnInit() {
    this.service.getDashboard().subscribe();
    this.service.dashboard.subscribe((res: any) => {
      this.cards = [
        {name: 'present', value: res.present, filter: 2},
        {name: 'late', value: res.late, filter: 6},
        {name: 'absent', value: res.absent, filter: 1},
        {name: 'leaves', value: res.leaves, filter: 7},
        {name: 'holiday', value: res.holidays, filter: 8},
        {name: 'weekend_leave', value: res.weekEnds, filter: 9},
        // {name: 'forget_checkin', value: res.forgetCheckIn, filter: 4},
        {name: 'forget_checkout', value: res.forgetCheckOut, filter: 5},
        {name: 'total_hours', value: parseInt(res.totalHours) || 0, filter: -1},
      ]
    })
  }


  filter(value: any) {
    let removeFilter = value == this.service.filterValue.value;
    if (removeFilter) {
      this.service.filterValue.next(null)
    } else {
      this.service.filterValue.next(value)
    }
    this.service.page.next(1);
    this.service.hasChanged.next(true);
  }
}
