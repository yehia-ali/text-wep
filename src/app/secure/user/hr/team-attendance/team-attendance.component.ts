import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from "../../../../core/components/layout.component";
import {TeamAttendancePageComponent} from "../../../../core/components/team-attendance-page/team-attendance-page.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {TeamAttendanceService} from "../../../../core/services/team-attendance.service";

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG'
} else {
  local = 'en-GB';
}

@Component({
  selector: 'team-attendance',
  standalone: true,
  imports: [CommonModule, TeamAttendancePageComponent, LayoutComponent, MagicScrollDirective],
  templateUrl: './team-attendance.component.html',
  styleUrls: ['./team-attendance.component.scss'],
})
export class TeamAttendanceComponent {
  service = inject(TeamAttendanceService)

  constructor() {
    this.service.limit.next(15)
  }
}
