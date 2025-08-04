import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateFilterComponent} from "../../../../../core/filters/date-filter.component";
import {MagicScrollDirective} from "../../../../../core/directives/magic-scroll.directive";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {PriorityFilterComponent} from "../../../../../core/filters/priority-filter.component";
import {SearchComponent} from "../../../../../core/filters/search.component";
import {TaskVoteSortComponent} from "../../../../../core/components/task-vote-sort.component";
import {TranslateModule} from "@ngx-translate/core";
import {VoteInboxService} from "../../../../../core/services/vote-inbox.service";
import {VoteStatusComponent} from "../../../../../core/filters/vote-status.component";

@Component({
  selector: 'inbox-filters',
  standalone: true,
  imports: [CommonModule, DateFilterComponent, MagicScrollDirective, MatCheckboxModule, PriorityFilterComponent, SearchComponent, TaskVoteSortComponent, TranslateModule, VoteStatusComponent],
  templateUrl: './inbox-filters.component.html',
  styleUrls: ['./inbox-filters.component.scss']
})
export class InboxFiltersComponent {
  service = inject(VoteInboxService);

  filter() {
    this.service.filter();
  }
}
