import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from "@angular/router";
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {LayoutComponent} from "../../../core/components/layout.component";
import {MagicScrollDirective} from "../../../core/directives/magic-scroll.directive";
import {TranslateModule} from "@ngx-translate/core";
import {FullCalendarModule} from "@fullcalendar/angular";
import {MatTooltipModule} from "@angular/material/tooltip";
import {CalendarOptions, EventApi} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import arLocale from '@fullcalendar/core/locales/ar';
import {MatDialog} from "@angular/material/dialog";
import {TaskDetailsService} from "../../../core/services/task-details.service";
import {CalendarService} from "../../../core/services/calendar.service";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatMenuModule} from "@angular/material/menu";
import {CreateTaskComponent} from "../../../core/components/create-task/create-task.component";
import {CreateVoteComponent} from "../../../core/components/create-vote/create-vote.component";
import {LeaveFormComponent} from "../hr/leave-form/leave-form.component";
import {TaskDetailsDialogComponent} from "../../../core/components/task-details-dialog/task-details-dialog.component";
import {VoteDetailsDialogComponent} from "../../../core/components/vote-details-dialog/vote-details-dialog.component";
import {VoteDetailsService} from "../../../core/services/vote-details.service";
import {LeavesDetailsService} from "../../../core/services/leaves-details.service";
import {LeaveDetailsDialogComponent} from "../../../core/components/leave-details-dialog/leave-details-dialog.component";
import {SelectUserComponent} from "../../../core/components/select-user.component";
import {TaskTypeComponent} from "../../../core/filters/task-type.component";
import {TaskStatusComponent} from "../../../core/filters/task-status.component";
import {IsRatedComponent} from "../../../core/filters/is-rated.component";
import {IsOverdueComponent} from "../../../core/filters/is-overdue.component";
import {ProjectsComponent} from "../../../core/filters/projects.component";
import {PriorityFilterComponent} from "../../../core/filters/priority-filter.component";
import {VoteStatusComponent} from "../../../core/filters/vote-status.component";
import {LeaveStatusComponent} from "../../../core/filters/leave-status.component";
import { LoadingComponent } from "../../../core/components/loading.component";

@Component({
    selector: 'calendar',
    standalone: true,
    templateUrl: './calendar2.component.html',
    styleUrls: ['./calendar2.component.scss'],
    imports: [CommonModule, UserNavbarComponent, LayoutComponent, MagicScrollDirective, TranslateModule, FullCalendarModule, MatTooltipModule, MatCheckboxModule, FormsModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, NgSelectModule, MatMenuModule, SelectUserComponent, TaskTypeComponent, TaskStatusComponent, PriorityFilterComponent, IsRatedComponent, IsOverdueComponent, ProjectsComponent, VoteStatusComponent, LeaveStatusComponent, LoadingComponent]
})
export class Calendar2Component {
  @ViewChild('calendar', {static: true}) calendar: any;
  dir = document.dir;
  inbox: any = [];
  events!: any;
  tasksToggle = true;
  meetingsToggle = false;
  votesToggle = false;
  holidaysToggle = false;
  leavesToggle = false;
  selected: Date | null;
  teamMembers$ = this.service.getTeamMembers();
  selectedUser = null;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'

    },
    ...(this.dir == 'rtl' && {locale: arLocale}),
    initialView: 'dayGridMonth',
    weekends: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.handleEventClick.bind(this),
    datesSet: (arg) => this.handleMonthChange(arg),
  };
  currentEvents: EventApi[] = [];
  filterType = 1;
  loading: any;

  constructor(private changeDetector: ChangeDetectorRef, public service: CalendarService, private dialog: MatDialog, private detailsSer: TaskDetailsService, private voteSer: VoteDetailsService, private leaveSer: LeavesDetailsService, private router: Router) {}

  changeFilterType(type: number) {
    if (this.filterType == type) {
      this.filterType = 0;
    } else {
      this.filterType = type;
    }
  }

  getMyCalendar() {
    this.loading = true
    this.service.getMyCalendar().subscribe((res:any) => {
   this.loading = false
    }
    );
  }

  handleMonthChange(arg: any) {
    const currentMonth = arg.view.currentStart.getMonth();
    const currentYear = arg.view.currentStart.getFullYear();
    this.service.startDate.next(new Date(currentYear, currentMonth, 1));
    this.service.lastDayOfMonth.next(new Date(currentYear, currentMonth + 1, 0));
    this.events = [];
    this.getMyCalendar()
  }

  ngOnInit() {
    this.service.myCalendar.subscribe((res: any) => {
      this.events = res;
    });
  }

  userChanged() {
    this.service.id.next(this.selectedUser || localStorage.getItem('id'));
    this.getMyCalendar();
  }


  handleEventClick(clickInfo: any) {
    if (clickInfo.event.extendedProps.calenderType == 1 || clickInfo.event.extendedProps.calenderType == 5) {
      this.getTask(clickInfo.event.extendedProps.myCalendarTaskId, clickInfo.event.extendedProps.calenderType);
    }

    if (clickInfo.event.extendedProps.calenderType == 2) {
      this.getVote(clickInfo.event.extendedProps.myCalendarTaskId);
    }

    if (clickInfo.event.extendedProps.calenderType == 3) {
      this.getLeave(clickInfo.event.extendedProps.myCalendarTaskId);
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  getTask(id: any, type: number) {
    this.detailsSer.id.next(id);
    let dialogRef = this.dialog.open(TaskDetailsDialogComponent, {
      panelClass: 'task-details-dialog',
      data: {
        type: type
      }
    });
    dialogRef.afterClosed().subscribe((res: { value: boolean | undefined }) => {
      if (!res?.value) {
        this.detailsSer.details.next({})
      } else {
        this.router.navigate([`/tasks/inbox/details/${id}`]);
      }
    })
  }

  getVote(id: any) {
    this.voteSer.id.next(id);
    let dialogRef = this.dialog.open(VoteDetailsDialogComponent, {
      panelClass: 'task-details-dialog'
    });
    dialogRef.afterClosed().subscribe((res: { value: boolean | undefined }) => {
      if (!res?.value) {
        this.detailsSer.details.next({})
      } else {
        this.router.navigate([`/votes/inbox/${id}`]);
      }
    })
  }

  getLeave(id: any) {
    this.leaveSer.id.next(id);
    let dialogRef = this.dialog.open(LeaveDetailsDialogComponent, {
      panelClass: 'task-details-dialog'
    });
    dialogRef.afterClosed().subscribe((res: { value: boolean | undefined }) => {
      if (!res?.value) {
        this.detailsSer.details.next({})
      } else {
        this.router.navigate([`/hr/leave-dashboard/details/${id}`]);
      }
    })
  }

  createTask() {
    this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      panelClass: 'create-task-dialog',
    });
  }

  createVote() {
    this.dialog.open(CreateVoteComponent, {
      panelClass: 'create-task-dialog',
    });
  }

  createMeeting() {
    this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      panelClass: 'create-task-dialog',
      data: {
        isMeeting: true,
      },
    });
  }

  createLeave() {
    this.dialog.open(LeaveFormComponent, {
      panelClass: 'create-task-dialog',
    });
  }
}

