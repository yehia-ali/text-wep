import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpisRoutingModule } from './kpis-routing.module';
import { KpisComponent } from './kpis.component';
import { SubSidebarComponent } from "../../../core/components/sub-sidebar.component";
import { SectionContentComponent } from "../../../core/components/section-content.component";
import { KpiBankComponent } from './kpi-bank/kpi-bank.component';
import { UserKpisComponent } from './user-kpis/user-kpis.component';
import { TranslateModule } from '@ngx-translate/core';
import { ChartRadialBarComponent } from 'src/app/core/components/charts/app-chart/chart-radial-bar.component';
import { LoadingComponent } from 'src/app/core/components/loading.component';
import { UsersFilterComponent } from 'src/app/core/components/new-filters/users-filter/users-filter.component';
import { ArabicDatePipe } from 'src/app/core/pipes/arabic-date.pipe';
import { ArabicNumbersPipe } from 'src/app/core/pipes/arabic-numbers.pipe';
import { DateFilterComponent } from "../../../core/components/new-filters/date-filter/date-filter.component";
import { LayoutComponent } from "../../../core/components/layout.component";
import { NotFoundComponent } from "../../../core/components/not-found.component";
import { MatMenuModule } from '@angular/material/menu';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { InfoSidebarComponent } from 'src/app/core/components/info-sidebar.component';
import { ArabicTimePipe } from 'src/app/core/pipes/arabic-time.pipe';
import { RaterKpisListComponent } from './rater-kpis/rater-kpis-list/rater-kpis-list.component';
import { SearchComponent } from "../../../core/filters/search.component";
import { UserWithImageComponent } from "../../../core/components/user-with-image/user-with-image.component";
import { KpiDetailsComponent } from './rater-kpis/kpi-details/kpi-details.component';
import { RaterKpisComponent } from './rater-kpis/rater-kpis.component';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    KpisComponent,
    UserKpisComponent,
    KpiBankComponent,
    RaterKpisListComponent,
    KpiDetailsComponent,
    RaterKpisComponent,
  ],
  imports: [
    CommonModule,
    KpisRoutingModule,
    SubSidebarComponent,
    SectionContentComponent,
    UsersFilterComponent,
    ChartRadialBarComponent,
    TranslateModule,
    ArabicNumbersPipe,
    ArabicDatePipe,
    LoadingComponent,
    DateFilterComponent,
    LayoutComponent,
    NotFoundComponent,
    MatMenuModule,
    NgxPaginationModule,
    InfoSidebarComponent,
    FormsModule,
    ArabicTimePipe,
    SearchComponent,
    UserWithImageComponent,
    MatTooltipModule
]
})
export class KpisModule { }
