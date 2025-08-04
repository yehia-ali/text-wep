import {Component, HostListener, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from "../../../../../core/filters/search.component";
import {TaskStatusComponent} from "../../../../../core/filters/task-status.component";
import {TaskTypeComponent} from "../../../../../core/filters/task-type.component";
import {PriorityFilterComponent} from "../../../../../core/filters/priority-filter.component";
import {IsRatedComponent} from "../../../../../core/filters/is-rated.component";
import {IsOverdueComponent} from "../../../../../core/filters/is-overdue.component";
import {DateFilterComponent} from "../../../../../core/filters/date-filter.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MagicScrollDirective} from "../../../../../core/directives/magic-scroll.directive";
import {TranslateModule} from "@ngx-translate/core";
import {TaskVoteSortComponent} from "../../../../../core/components/task-vote-sort.component";
import {SelectUserComponent} from "../../../../../core/components/select-user.component";
import {InputLabelComponent} from "../../../../../core/inputs/input-label.component";
import {ProjectsComponent} from "../../../../../core/filters/projects.component";
import {MeetingService} from "../../../../../core/services/meeting.service";

@Component({
  selector: 'meeting-filters',
  standalone: true,
  imports: [CommonModule, SearchComponent, TaskStatusComponent, TaskTypeComponent, PriorityFilterComponent, IsRatedComponent, IsOverdueComponent, DateFilterComponent, MatCheckboxModule, MagicScrollDirective, TranslateModule, TaskVoteSortComponent, SelectUserComponent, InputLabelComponent, ProjectsComponent],
  templateUrl: './meeting-filters.component.html',
  styleUrls: ['./meeting-filters.component.scss']
})
export class MeetingFiltersComponent {
  service = inject(MeetingService);
  showFilters = false;
  visibleFilters: any = {
    // creator: false || this.service.creatorValue.length > 0,
    priority: false || this.service.priority.value.length > 0,
    overdue: false || (this.service.isOverdue.value == true || this.service.isOverdue.value == false),
    project: false || this.service.project.value.length > 0,
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
