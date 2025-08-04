import {Component, EventEmitter, HostListener, inject, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AssigneeStateComponent} from "../../../../../core/filters/assignee-state.component";
import {DateFilterComponent} from "../../../../../core/filters/date-filter.component";
import {DepartmentsComponent} from "../../../../../core/filters/departments.component";
import {IsOverdueComponent} from "../../../../../core/filters/is-overdue.component";
import {IsRatedComponent} from "../../../../../core/filters/is-rated.component";
import {MagicScrollDirective} from "../../../../../core/directives/magic-scroll.directive";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {PriorityFilterComponent} from "../../../../../core/filters/priority-filter.component";
import {RateValueComponent} from "../../../../../core/filters/rate-value.component";
import {SearchComponent} from "../../../../../core/filters/search.component";
import {SelectUserComponent} from "../../../../../core/components/select-user.component";
import {TaskStatusComponent} from "../../../../../core/filters/task-status.component";
import {TaskTypeComponent} from "../../../../../core/filters/task-type.component";
import {TaskVoteSortComponent} from "../../../../../core/components/task-vote-sort.component";
import {TranslateModule} from "@ngx-translate/core";
import {UsersAttendanceService} from "../../../../../core/servicess/users-attendance.service";
import {AttendnaceTypeComponent} from "../../../../../core/filters/attendnace-type.component";

@Component({
    selector: 'users-attendance-filter',
    standalone: true,
    imports: [CommonModule, AssigneeStateComponent, DateFilterComponent, DepartmentsComponent, IsOverdueComponent, IsRatedComponent, MagicScrollDirective, MatButtonModule, MatCheckboxModule, PriorityFilterComponent, RateValueComponent, SearchComponent, SelectUserComponent, TaskStatusComponent, TaskTypeComponent, TaskVoteSortComponent, TranslateModule, AttendnaceTypeComponent],
    templateUrl: './users-attendance-filter.component.html',
    styleUrls: ['./users-attendance-filter.component.scss']
})
export class UsersAttendanceFilterComponent {
    @Output() export = new EventEmitter();
    service = inject(UsersAttendanceService);
    showFilters = false;
    visibleFilters: any = {
        departments: true || this.service.department.value.length > 0,
        transaction_type: false || this.service.attendanceType.value,
        managers: false || this.service.managers.value.length > 0,
        date: true || this.service.dateFrom.value || this.service.dateTo.value,
    }
    filtersArray = Object.keys(this.visibleFilters).map(filter => {
        return filter
    });

    filter() {
        this.service.filter();
    }

    unCheck(filter: any) {
        this.visibleFilters[filter] = !this.visibleFilters[filter];
    }

    @HostListener('document:click', ['$event']) documentClickEvent($event: MouseEvent) {
        this.showFilters = false;
    }
}
