import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-date-filter',
  standalone: true,
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule , TranslateModule , CalendarModule]
})
export class DateFilterComponent {
  @Input() selectedValue: any; // Adjust type if necessary
  @Output() valueChanged = new EventEmitter<any>();
  @Input() classes = '';
  @Input() small = true;
  @Input() icon = true;
  @Input() title:any = 'date';
  @Input() startDate:any = new Date().setDate(1);
  @Input() endDate:any = new Date();
  @Input() clearable = false;
  @Input() width = '';
  @Input() hideLabel = false;
  @Input() key = '';

  rangeDates: any = [
    new Date(this.startDate), // start
    new Date(this.endDate),   // end
  ];

  constructor(private datePipe : DatePipe){}

  onChange(event:any) {
    let date = {
      startDate: this.datePipe.transform(event[0] , 'yyyy-MM-dd') || null,
      endDate:   this.datePipe.transform(event[1] , 'yyyy-MM-dd') || null,
    }
    if(date.startDate && date.endDate){

    }
    this.valueChanged.emit(date);
  }
}
