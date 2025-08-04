import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VotesRoutingModule} from './votes-routing.module';
import {VotesComponent} from './votes.component';
import {SectionContentComponent} from "../../../core/components/section-content.component";
import {SubSidebarComponent} from "../../../core/components/sub-sidebar.component";


@NgModule({
  declarations: [
    VotesComponent
  ],
  imports: [
    CommonModule,
    VotesRoutingModule,
    SectionContentComponent,
    SubSidebarComponent
  ]
})
export class VotesModule {
}
