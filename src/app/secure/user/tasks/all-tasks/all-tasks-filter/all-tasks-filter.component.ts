import {Component, EventEmitter, HostListener, inject, Output} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DateFilterComponent} from "../../../../../core/filters/date-filter.component";
import {IsOverdueComponent} from "../../../../../core/filters/is-overdue.component";
import {IsRatedComponent} from "../../../../../core/filters/is-rated.component";
import {MagicScrollDirective} from "../../../../../core/directives/magic-scroll.directive";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {PriorityFilterComponent} from "../../../../../core/filters/priority-filter.component";
import {SearchComponent} from "../../../../../core/filters/search.component";
import {SelectUserComponent} from "../../../../../core/components/select-user.component";
import {TaskStatusComponent} from "../../../../../core/filters/task-status.component";
import {TaskTypeComponent} from "../../../../../core/filters/task-type.component";
import {TaskVoteSortComponent} from "../../../../../core/components/task-vote-sort.component";
import {TranslateModule} from "@ngx-translate/core";
import {AllTasksService} from "../../../../../core/services/all-tasks.service";
import {DepartmentsComponent} from "../../../../../core/filters/departments.component";
import {AssigneeStateComponent} from "../../../../../core/filters/assignee-state.component";
import {RateValueComponent} from "../../../../../core/filters/rate-value.component";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {HandoverComponent} from "../../../../../core/components/handover.component";
import {RepeatComponent} from "../../../../../core/filters/repeat/repeat.component";
import {ChangeCreatorComponent} from "../../../../../core/components/change-creator/change-creator.component";
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'all-tasks-filter',
  standalone: true,
  imports: [CommonModule, DateFilterComponent, IsOverdueComponent, IsRatedComponent, MagicScrollDirective, MatCheckboxModule, PriorityFilterComponent, SearchComponent, SelectUserComponent, TaskStatusComponent, TaskTypeComponent, TaskVoteSortComponent, TranslateModule, DepartmentsComponent, AssigneeStateComponent, RateValueComponent, MatButtonModule, RepeatComponent],
  templateUrl: './all-tasks-filter.component.html',
  styleUrls: ['./all-tasks-filter.component.scss']
})
export class AllTasksFilterComponent {
  @Output() export = new EventEmitter();
  service = inject(AllTasksService);
  dialog = inject(MatDialog);
  showFilters = false;
  customSpaceId:any  = localStorage.getItem('space-id')
  visibleFilters: any = {
    creators: false || this.service.creators.value.length > 0,
    assignees: false || this.service.assignees.value.length > 0,
    task_type: false || this.service.taskType.value.length > 0,
    priority: false || this.service.priority.value.length > 0,
    repeatPeriod: false || this.service.repeatPeriod.value,
    departments: false || this.service.department.value.length > 0,
    assignee_state: false || this.service.department.value.length > 0,
    overdue: false || (this.service.isOverdue.value == true || this.service.isOverdue.value == false),
    rate: false || this.service.rated.value,
    rate_value: false || this.service.rateValue.value.length > 0,
    date: true || this.service.dateFrom.value || this.service.dateTo.value,
  }
  constructor(private datePipe : DatePipe){}
  filtersArray = Object.keys(this.visibleFilters).map(filter => {
    return filter
  });

  filter() {
    this.service.filter();
  }

  handover() {
    this.dialog.open(HandoverComponent, {
      panelClass: 'dialog-message',
      data: {
        tasks: this.service.selectedTasksToHandoverValue
      }
    })
  }

  changeCreator() {
    this.dialog.open(ChangeCreatorComponent, {
      panelClass: 'dialog-message',
      data: {
        tasks: this.service.selectedTasksToHandoverValue
      }
    })
  }

  unCheck(filter: any) {
    this.visibleFilters[filter] = !this.visibleFilters[filter];
  }

  @HostListener('document:click', ['$event']) documentClickEvent($event: MouseEvent) {
    this.showFilters = false;
  }

  downloadExcel() {

    let params = new HttpParams()

    const arrayParams = [
      { key: 'states', value: this.service.taskStatus.value },
      { key: 'priorities', value: this.service.priority.value },
      { key: 'rate', value: this.service.rateValue.value },
      { key: 'TaskGroupType', value: this.service.taskType.value },
      { key: 'assigneeDepartments', value: this.service.department.value }
    ];
    const usersParams = [
      { key: 'creators', value: this.service.creators.value },
      { key: 'assignees', value: this.service.assignees.value },
    ];

    arrayParams.forEach(param => {
      if (param.value.length > 0) {
        param.value.forEach((item: string | number) => {
          params = params.append(param.key, item.toString());
        });
      }
    });
    usersParams.forEach(param => {
      if (param.value.length > 0) {
        param.value.forEach((item: any) => {
          params = params.append(param.key, item.id.toString());
        });
      }
    });

    const singleParams = [
      { key: 'search', value: this.service.search.value },
      { key: 'isRated', value: this.service.rated.value },
      { key: 'isRepeated', value: this.service.repeatPeriod.value },
      { key: 'taskRepeatedPeriod', value: this.service.repeatPeriod.value },
      { key: 'assigneeIsActive', value: this.service.assigneeState.value },
      { key: 'startDateFrom', value: this.datePipe.transform(this.service.dateFrom.value , 'yyyy-MM-ddT00:00:01') },
      { key: 'startDateTo', value:  this.datePipe.transform(this.service.dateTo.value , 'yyyy-MM-ddT11:59:59')},
    ];

    singleParams.forEach(param => {
      if (param.value) {
        params = params.set(param.key, param.value.toString());
      }
    });

    this.service.getTasksExcel(params).subscribe((data: Blob) => {
      console.log(arrayParams);

      // Create a link element for download
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Tasks_${new Date().toISOString().replace(/[-:T]/g, '').split('.')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

}
