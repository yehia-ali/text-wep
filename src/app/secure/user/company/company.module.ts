import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import {SectionContentComponent} from "../../../core/components/section-content.component";
import {SubSidebarComponent} from "../../../core/components/sub-sidebar.component";
import { UserHierarchyComponent } from './user-hierarchy/user-hierarchy.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserWithImageComponent } from "../../../core/components/user-with-image/user-with-image.component";
import { OrganizationChartModule } from 'primeng/organizationchart';
import { LayoutComponent } from "../../../core/components/layout.component";
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [
    CompanyComponent,
    UserHierarchyComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    SectionContentComponent,
    SubSidebarComponent,
    // user UserHierarchyComponent imports
    TranslateModule,
    UserWithImageComponent,
    OrganizationChartModule,
    LayoutComponent,
    AccordionModule
]
})
export class CompanyModule { }
