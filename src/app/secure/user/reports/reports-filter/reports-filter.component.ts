import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AssigneeStateComponent} from "../../../../core/filters/assignee-state.component";
import {DateFilterComponent} from "../../../../core/filters/date-filter.component";
import {DepartmentsComponent} from "../../../../core/filters/departments.component";
import {IsOverdueComponent} from "../../../../core/filters/is-overdue.component";
import {IsRatedComponent} from "../../../../core/filters/is-rated.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {PriorityFilterComponent} from "../../../../core/filters/priority-filter.component";
import {RateValueComponent} from "../../../../core/filters/rate-value.component";
import {SearchComponent} from "../../../../core/filters/search.component";
import {SelectUserComponent} from "../../../../core/components/select-user.component";
import {TaskStatusComponent} from "../../../../core/filters/task-status.component";
import {TaskTypeComponent} from "../../../../core/filters/task-type.component";
import {TaskVoteSortComponent} from "../../../../core/components/task-vote-sort.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'reports-filter',
    standalone: true,
    imports: [CommonModule, AssigneeStateComponent, DateFilterComponent, DepartmentsComponent, IsOverdueComponent, IsRatedComponent, MagicScrollDirective, MatButtonModule, MatCheckboxModule, PriorityFilterComponent, RateValueComponent, SearchComponent, SelectUserComponent, TaskStatusComponent, TaskTypeComponent, TaskVoteSortComponent, TranslateModule],
    templateUrl: './reports-filter.component.html',
    styleUrls: ['./reports-filter.component.scss']
})
export class ReportsFilterComponent {
    @Input() service: any;
    @Output() export = new EventEmitter();

    filter() {
        this.service.filter();
    }

}
