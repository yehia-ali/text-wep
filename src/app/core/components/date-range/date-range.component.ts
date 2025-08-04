import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FilterLabelComponent } from '../../filters/filter-label.component';
import { MatButtonModule } from '@angular/material/button';
import { ArabicDatePipe } from "../../pipes/arabic-date.pipe";

let dir = document.dir;
let local = dir === 'rtl' ? 'ar-EG' : 'en-GB';

@Component({
  selector: 'app-date-range',
  standalone: true,
  encapsulation: ViewEncapsulation.None, // Disable encapsulation to apply styles globally
  imports: [
    MatNativeDateModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    TranslateModule,
    FilterLabelComponent,
    MatButtonModule,
    ArabicDatePipe
],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: local },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent {
  @Input() width = 'w-20r';
  @Input() label = 'date';
  @Input() hideLabel = false;
  @Input() newFilter = false;
  @Input() maxDate:any = new Date()
  @Input() startDate: any|Date = this.datePipe.transform(new Date() , 'yyyy-MM-01');
  @Input() endDate: any | Date =this.datePipe.transform(new Date() , 'yyyy-MM-dd');
  @Output() valueChanged = new EventEmitter<{ startDate: any; endDate: any }>();
  @Input() clearData = false;
  dateChangedStatus = false;

  constructor(private datePipe:DatePipe){}

  dateChanged() {
    if(!this.endDate){
      this.endDate = this.startDate
    }
    this.valueChanged.emit({ startDate: this.startDate, endDate: this.endDate });
  }
}
