import { Attendance } from './../../../core/interfaces/attendance';
import {Component, EventEmitter, inject, OnDestroy, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter,} from '@angular/material-moment-adapter';
import {DashboardService} from "./dashboard.service";
import {DoughnutChartComponent} from "../../../core/components/doughnut-chart/doughnut-chart.component";
import {User} from "../../../core/interfaces/user";
import {UserService} from "../../../core/services/user.service";
import {RolesService} from "../../../core/services/roles.service";
import {PageInfoService} from "../../../core/services/page-info.service";
import { AttendanceService } from 'src/app/core/services/attendance.service';
import { LeavesRequestsService } from 'src/app/core/services/leaves-requests.service';
import { interval } from 'rxjs';

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG'
} else {
  local = 'en-GB';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: local},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChildren(DoughnutChartComponent) donutChart!: QueryList<DoughnutChartComponent>;
  pageInfoSer = inject(PageInfoService);
  statistics: any;
  workingHours: any;
  startDate: any;
  endDate = new Date();
  isManager!: boolean;
  @Output() statusChanged = new EventEmitter();
  canAccessAdmin = false;
  shiftStart :any
  shiftEnd :any
  cards :any[] = [];
  user!: any;
  lastAttendance: any;
  clickable = true;
  totalShiftTime:any = '00:00:00'
  leaves: any

  constructor(
    public service: DashboardService,
    private rolesSer: RolesService,
    private userSer: UserService,
    private attendanceService: AttendanceService,
    private leavesRequestsService: LeavesRequestsService,

  ) {
    this.service.startDateFrom.subscribe((res) => {
      this.startDate = res;
    });
    this.service.startDateTo.subscribe((res) => {
      this.endDate = res;
    });
  }

  ngOnInit(): void {
    this.getLeaves()
    this.pageInfoSer.pageInfoEnum.next('Dashboard');
    this.rolesSer.isManager.subscribe((res) => {
      this.isManager = res;
      if (this.isManager) {
        this.getTeamReport();
      }
      this.cards = [
        {
          title: 'sent_tasks',
          number: 0,
          link: '/tasks/sent',
          image: 'bx-upload',
          color: 'primary bg-light-violet',
          show: true,
        },
        {
          title: 'cc_tasks',
          number: 0,
          link: '/tasks/cc',
          image: 'bx-group',
          color: 'danger bg-light-danger',
          show: true,
        },
        {
          title: 'task_requests',
          number: 0,
          link: '/tasks/requests',
          image: 'bx-list-check',
          color: 'warning bg-light-warning',
          show: this.isManager,
        },
        {
          title: 'space_requests',
          number: 0,
          link: '/company/requests',
          image: 'bx-log-in-circle',
          color: 'blue bg-light-blue',
          show: this.isManager,
        },
        {
          title: 'leaves_requests',
          number: 0,
          link: '/hr/leaves-requests',
          image: 'bx-joystick',
          color: 'success bg-light-success',
          show: this.isManager,
        },
      ];

    });
    this.getFunctions();
    this.userSer.user$.subscribe(res => this.user = res);
    this.rolesSer.canAccessAdmin.subscribe(res => this.canAccessAdmin = res);
    this.getLastAttendance();
  }

  getLastAttendance() {
    this.attendanceService.getLastAttendance().subscribe((res: any) => {
      this.lastAttendance = res.data;
      this.clickable = true;
      if(this.lastAttendance.status == 1){
        setTimeout(() => {
          const firstCheck = new Date(this.lastAttendance.firstCheckIn)
          const now = new Date();
          const diff = now.getTime() - firstCheck.getTime();
          this.msToTime(diff);

        }, 1000);
       }
    });
  }

  getInboxReport() {
    this.service.getInboxReport().subscribe((res) => {
      let arr = [
        res.newTasks.totalCount,
        res.inprogressTasks.totalCount,
        res.completedTasks.totalCount,
      ];
      this.donutChart.forEach((chart, index) => {
        if (index == 0) {
          chart.arr = arr;
          chart.triggerChart();
        }
      });
      this.statistics = [
        {
          title: 'inbox',
          total: res.taskTotalCount,
          percentages: [
            res.newTasks.percentage,
            res.inprogressTasks.percentage,
            res.completedTasks.percentage,
          ],
          lines: [
            {
              name: 'new',
              total: res.newTasks.totalCount,
            },
            {
              name: 'in_progress',
              total: res.inprogressTasks.totalCount,
            },
            {
              name: 'completed',
              total: res.completedTasks.totalCount,
            },
          ],
          classes: ['primary', 'warning', 'success'],
        },
        {
          title: 'completed',
          total: res.completedTasks.totalCount,
          percentages: [
            res.completedTasks.onTimePercentage,
            res.completedTasks.overDuePercentage,
          ],
          lines: [
            {
              name: 'on_time',
              total: res.completedTasks.onTimeCount,
            },
            {
              name: 'overdue',
              total: res.completedTasks.overDueCount,
            },
          ],
          classes: ['success', 'danger'],
        },
        {
          title: 'overdue',
          total: res.overDueTasks.totalCount,
          percentages: [
            res.overDueTasks.colsedPercentage,
            res.overDueTasks.openedPercentage,
          ],
          lines: [
            {
              name: 'closed',
              total: res.overDueTasks.colsedCount,
            },
            {
              name: 'open',
              total: res.overDueTasks.openedCount,
            },
          ],
          classes: ['closed-color', 'danger'],
        },
      ];
      this.workingHours = res.workingHours;
    });
  }

  getTeamReport() {
    this.service.getTeamReport().subscribe((res: any) => {
      let data = res.data;
      let arr = [
        data.newTasks.totalCount,
        data.inprogressTasks.totalCount,
        data.completedTasks.totalCount,
      ];
      this.donutChart.forEach((chart, index) => {
        if (index == 1) {
          chart.arr = arr;
          chart.triggerChart();
        }
      });
    });
  }

  getDashboardData() {
    this.service.getDashboard().subscribe((res: any) => {
      this.cards[0].number = res.data.taskGroupCount;
      this.cards[1].number = res.data.taskReportingCount;
      this.cards[2].number = res.data.taskRequestCount;
      this.cards[3].number = res.data.joinRequestCount;
      this.cards[4].number = this.leaves;
    });
  }

  dateChanged() {
    this.service.startDateFrom.next(this.startDate);
    this.service.startDateTo.next(this.endDate);
    this.getFunctions();
  }

  getFunctions() {
    this.getInboxReport();
    this.getDashboardData();
  }

  ngOnDestroy() {
    this.pageInfoSer.pageInfoEnum.next('');
  }

  msToTime(duration: number){
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const timer$ = interval(1000);

    timer$.subscribe(() => {

      seconds++;
      if(seconds >= 60){
        seconds = 0
        minutes++
      }
      if(minutes >= 60){
        minutes = 0;
        hours++
      }
      this.totalShiftTime = `${hours<10 ? '0'+ (hours - 3) : (hours - 3)}:${minutes<10 ? '0'+minutes : minutes}:${seconds<10 ? '0'+seconds : seconds}`;
    });
  }

  check(status = 1) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (this.clickable) {

          this.clickable = false;
          const data = {
            status,
            macAddress: null,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          this.attendanceService.check(data).subscribe(() => {
            this.getLastAttendance();
            this.statusChanged.emit();
          });
        }
      });
    }
  }
  getLeaves(){
    this.leavesRequestsService.getRequests().subscribe((res:any) => {
      this.leaves = res.data.totalItems
      console.log(this.leaves);

    })
  }
}
