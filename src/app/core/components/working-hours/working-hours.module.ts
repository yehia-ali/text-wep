import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkingHoursComponent } from './working-hours.component';
import {TranslateModule} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";



@NgModule({
  declarations: [
    WorkingHoursComponent
  ],
    imports: [
        CommonModule,
        TranslateModule,
        ArabicNumbersPipe
    ],
  exports: [
    WorkingHoursComponent
  ]
})
export class WorkingHoursModule { }
