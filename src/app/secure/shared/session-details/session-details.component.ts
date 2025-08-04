import {Component, computed, OnDestroy, OnInit, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {TopSectionComponent} from "./components/top-section/top-section.component";
import {SessionDetailsButtonsComponent} from "./components/session-details-buttons/session-details-buttons.component";
import {SessionDetails} from "../../../core/interfaces/session-details";
import {LayoutComponent} from "../../../core/components/layout.component";
import {UserImageComponent} from "../../../core/components/user-image.component";
import {SessionDetailsService} from "../../../core/services/session-details.service";
import {ArabicDatePipe} from "../../../core/pipes/arabic-date.pipe";
import {ArabicTimePipe} from "../../../core/pipes/arabic-time.pipe";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'session-details',
  standalone: true,
  imports: [CommonModule, LayoutComponent, TranslateModule, UserImageComponent, TopSectionComponent, SessionDetailsButtonsComponent, ArabicDatePipe, ArabicTimePipe],
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss']
})
export class SessionDetailsComponent implements OnInit, OnDestroy {
  sessionDetails: Signal<SessionDetails> = computed(() => this.service.sessionDetails());
  source1$!: Subscription;

  constructor(private service: SessionDetailsService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.source1$ = this.route.params.subscribe(params => {
      this.service.sessionId.next(params['id']);
      this.service.hasChanged.next(true);
    });
  }

  ngOnDestroy() {
    this.source1$.unsubscribe();
    this.service.sessionDetails.set({} as SessionDetails);
  }

  protected readonly environment = environment;
}
