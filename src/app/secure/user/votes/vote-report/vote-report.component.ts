import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VoteReportService} from "../../../../core/services/vote-report.service";
import {VoteReport} from "../../../../core/interfaces/vote-report";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {LoadingComponent} from "../../../../core/components/loading.component";
import {PriorityComponent} from "../../../../core/components/priority.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import {ArabicNumbersPipe} from "../../../../core/pipes/arabic-numbers.pipe";
import {MultiAnswerComponent} from "./multi-answer/multi-answer.component";
import {SingleAnswerComponent} from "./single-answer/single-answer.component";

@Component({
  selector: 'vote-report',
  standalone: true,
  imports: [CommonModule, LayoutComponent, LoadingComponent, PriorityComponent, MagicScrollDirective, ArabicNumbersPipe, MultiAnswerComponent, SingleAnswerComponent],
  templateUrl: './vote-report.component.html',
  styleUrls: ['./vote-report.component.scss']
})
export class VoteReportComponent {
  service = inject(VoteReportService);
  route = inject(ActivatedRoute)
  id = +this.route.snapshot.params['id'];
  report$: Observable<VoteReport> = this.service.getReport(this.id);

}
