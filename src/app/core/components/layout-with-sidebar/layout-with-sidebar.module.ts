import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutWithSidebarComponent } from './layout-with-sidebar.component';
import {LayoutComponent} from "../layout.component";
import {MagicScrollDirective} from "../../directives/magic-scroll.directive";



@NgModule({
  declarations: [
    LayoutWithSidebarComponent
  ],
    imports: [
        CommonModule,
        LayoutComponent,
        MagicScrollDirective,
        LayoutComponent
    ],
  exports: [
    LayoutWithSidebarComponent
  ]
})
export class LayoutWithSidebarModule { }
