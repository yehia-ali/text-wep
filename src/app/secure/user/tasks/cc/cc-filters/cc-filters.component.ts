import {Component, HostListener, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskCcService} from "../../../../../core/services/task-cc.service";
import {DateFilterComponent} from "../../../../../core/filters/date-filter.component";
import {IsOverdueComponent} from "../../../../../core/filters/is-overdue.component";
import {IsRatedComponent} from "../../../../../core/filters/is-rated.component";
import {MagicScrollDirective} from "../../../../../core/directives/magic-scroll.directive";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {PriorityFilterComponent} from "../../../../../core/filters/priority-filter.component";
import {SearchComponent} from "../../../../../core/filters/search.component";
import {TaskVoteSortComponent} from "../../../../../core/components/task-vote-sort.component";
import {TaskStatusComponent} from "../../../../../core/filters/task-status.component";
import {TaskTypeComponent} from "../../../../../core/filters/task-type.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'cc-filters',
  standalone: true,
  imports: [CommonModule, DateFilterComponent, IsOverdueComponent, IsRatedComponent, MagicScrollDirective, MatCheckboxModule, PriorityFilterComponent, SearchComponent, TaskVoteSortComponent, TaskStatusComponent, TaskTypeComponent, TranslateModule],
  templateUrl: './cc-filters.component.html',
  styleUrls: ['./cc-filters.component.scss']
})
export class CcFiltersComponent {
  service = inject(TaskCcService);
  showFilters = false;
  visibleFilters: any = {
    // creator: false || this.service.creatorValue.length > 0,
    priority: false || this.service.priority.value.length > 0,
    rate: false || this.service.rated.value,
    overdue: false || (this.service.isOverdue.value == true || this.service.isOverdue.value == false),
    date: false || this.service.dateFrom.value || this.service.dateTo.value,
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
