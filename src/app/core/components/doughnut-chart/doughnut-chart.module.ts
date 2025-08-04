import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoughnutChartComponent } from './doughnut-chart.component';
import {TranslateModule} from "@ngx-translate/core";
import {NgApexchartsModule} from "ng-apexcharts";



@NgModule({
  declarations: [
    DoughnutChartComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgApexchartsModule,
  ],
  exports: [
    DoughnutChartComponent
  ]
})
export class DoughnutChartModule { }
