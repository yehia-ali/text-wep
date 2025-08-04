import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DashboardService} from "../../dashboard.service";
import {TaskSentService} from "../../../../../core/services/task-sent.service";
import {TaskCcService} from "../../../../../core/services/task-cc.service";

@Component({
  selector: 'dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit {
  @Input() item!:any;

  constructor(private router: Router, private dashboardSer: DashboardService, private sentSer: TaskSentService, private ccSer: TaskCcService) {
  }

  ngOnInit(): void {
  }

  routeMe(link: any, name: string) {
    if (name == 'sent_tasks') {
      this.sentSer.dateFrom.next(this.dashboardSer.startDateFromValue);
      this.sentSer.dateTo.next(this.dashboardSer.startDateToValue);
      // if (this.sentSer.userIdValue) {
      //   this.sentSer.getUserSent().subscribe(() => this.sentSer.loading.next(false));
      // } else {
      //   this.sentSer.getSent().subscribe(() => this.sentSer.loading.next(false));
      // }
    } else if (name == 'cc_tasks') {
      this.ccSer.dateFrom.next(this.dashboardSer.startDateFromValue);
      this.ccSer.dateTo.next(this.dashboardSer.startDateToValue);
      this.ccSer.hasChanged.next(true)
    }
    this.router.navigate([link])
  }

}
