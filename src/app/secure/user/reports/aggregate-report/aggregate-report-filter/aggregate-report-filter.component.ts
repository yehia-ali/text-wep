import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateFilterComponent} from "../../../../../core/filters/date-filter.component";
import {DepartmentsComponent} from "../../../../../core/filters/departments.component";
import {MatButtonModule} from "@angular/material/button";
import {SearchComponent} from "../../../../../core/filters/search.component";
import {TranslateModule} from "@ngx-translate/core";
import {AssigneeStateComponent} from "../../../../../core/filters/assignee-state.component";

@Component({
  selector: 'aggregate-report-filter',
  standalone: true,
  imports: [CommonModule, DateFilterComponent, DepartmentsComponent, MatButtonModule, SearchComponent, TranslateModule, AssigneeStateComponent],
  templateUrl: './aggregate-report-filter.component.html',
  styleUrls: ['./aggregate-report-filter.component.scss']
})
export class AggregateReportFilterComponent {
  @Input() service: any;
  @Output() export = new EventEmitter();

  filter() {
    this.service.filter();
  }
}
