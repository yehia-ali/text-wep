import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WalletRoutingModule} from './wallet-routing.module';
import {WalletComponent} from './wallet.component';
import {SectionContentComponent} from "../../../core/components/section-content.component";
import {SubSidebarComponent} from "../../../core/components/sub-sidebar.component";
import {UserNavbarComponent} from "../../../core/components/user-navbar/user-navbar.component";
import {NotFoundComponent} from "../../../core/components/not-found.component";
import {LoadingComponent} from "../../../core/components/loading.component";
import {LayoutWithFiltersComponent} from "../../../core/components/layout-with-filters.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgxPaginationModule} from "ngx-pagination";
import {ArabicDatePipe} from "../../../core/pipes/arabic-date.pipe";
import {UserImageComponent} from "../../../core/components/user-image.component";
import {ArabicNumbersPipe} from "../../../core/pipes/arabic-numbers.pipe";
import {WalletFilterComponent} from "./wallet-filter/wallet-filter.component";
import {UserBalanceComponent} from "../../../core/components/user-balance/user-balance.component";


@NgModule({
  declarations: [
    WalletComponent
  ],
  imports: [
    CommonModule,
    WalletRoutingModule,
    SectionContentComponent,
    SubSidebarComponent,
    UserNavbarComponent,
    NotFoundComponent,
    LoadingComponent,
    LayoutWithFiltersComponent,
    TranslateModule,
    NgxPaginationModule,
    ArabicDatePipe,
    UserImageComponent,
    ArabicNumbersPipe,
    WalletFilterComponent,
    UserBalanceComponent,
  ]
})
export class WalletModule {
}
