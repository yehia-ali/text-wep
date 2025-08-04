import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateFilterComponent} from "../../../../../core/filters/date-filter.component";
import {PriorityFilterComponent} from "../../../../../core/filters/priority-filter.component";
import {SearchComponent} from "../../../../../core/filters/search.component";
import {TaskVoteSortComponent} from "../../../../../core/components/task-vote-sort.component";
import {VoteStatusComponent} from "../../../../../core/filters/vote-status.component";
import {VoteSentService} from "../../../../../core/services/vote-sent.service";
import {VoteIsCanceledComponent} from "../../../../../core/filters/vote-is-canceled.component";

@Component({
  selector: 'sent-filters',
  standalone: true,
  imports: [CommonModule, DateFilterComponent, PriorityFilterComponent, SearchComponent, TaskVoteSortComponent, VoteStatusComponent, VoteIsCanceledComponent],
  templateUrl: './sent-filters.component.html',
  styleUrls: ['./sent-filters.component.scss']
})
export class SentFiltersComponent {
  service = inject(VoteSentService);

  filter() {
    this.service.filter();
  }
}
