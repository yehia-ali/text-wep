import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsCardComponent } from './statistics-card.component';
import {TranslateModule} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";



@NgModule({
  declarations: [
    StatisticsCardComponent
  ],
    imports: [
        CommonModule,
        TranslateModule,
        ArabicNumbersPipe
    ],
  exports: [
    StatisticsCardComponent
  ]
})
export class StatisticsCardModule { }
