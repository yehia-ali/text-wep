import { Component } from '@angular/core';
import { TeamAttendancePageComponent } from "../../../../core/components/team-attendance-page/team-attendance-page.component";
import { UserNavbarComponent } from "../../../../core/components/user-navbar/user-navbar.component";
import { LayoutComponent } from "../../../../core/components/layout.component";

@Component({
  selector: 'manager-attendance',
  templateUrl: './manager-attendance.component.html',
  styleUrls: ['./manager-attendance.component.scss'],
  standalone:true,
  imports: [TeamAttendancePageComponent, UserNavbarComponent, LayoutComponent]
})
export class ManagerAttendanceComponent {

}
