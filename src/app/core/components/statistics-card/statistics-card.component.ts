import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TaskInboxService} from "../../services/task-inbox.service";
import {DashboardService} from "../../../secure/user/dashboard/dashboard.service";

@Component({
  selector: 'statistics-card',
  templateUrl: './statistics-card.component.html',
  styleUrls: ['./statistics-card.component.scss']
})
export class StatisticsCardComponent implements OnInit {
  @Input() data: any;
  @Input() projectId!: number;
  startDate: any;
  endDate: any;

  constructor(private inboxSer: TaskInboxService, private router: Router, private dashboardSer: DashboardService) {
    this.dashboardSer.startDateFrom.subscribe(res => this.startDate = res);
    this.dashboardSer.startDateTo.subscribe(res => this.endDate = res);
  }

  ngOnInit(): void {
  }

  filter(type: string) {
    // this.inboxSer.tasks.next([]);
    this.inboxSer.resetFilter();
    this.inboxSer.loading.next(true);
    if (this.projectId) {
      this.inboxSer.project.next([this.projectId])
    } else {
      this.inboxSer.dateFrom.next(this.startDate);
      this.inboxSer.dateTo.next(this.endDate);
    }
    this.inboxSer.search.next('')
    if (type == 'new') {
      this.inboxSer.taskStatus.next(['1']);
    } else if (type == 'in_progress') {
      this.inboxSer.taskStatus.next(['3']);
    } else if (type == 'completed') {
      this.inboxSer.taskStatus.next(['2']);
    } else if (type == 'on_time') {
      this.inboxSer.taskStatus.next(['2']);
      this.inboxSer.isOverdue.next(false);
    } else if (type == 'overdue') {
      this.inboxSer.taskStatus.next(['2']);
      this.inboxSer.isOverdue.next(true);
    } else if (type == 'closed') {
      this.inboxSer.isOverdue.next(true);
      this.inboxSer.taskStatus.next(['2']);
    } else if (type == 'open') {
      this.inboxSer.isOverdue.next(true);
      this.inboxSer.taskStatus.next(['1', '3']);
    }


    // this.inboxSer.getInbox().subscribe();
    this.router.navigate(['/tasks/inbox']);
  }

}
