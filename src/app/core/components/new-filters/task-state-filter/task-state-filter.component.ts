import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { enumToArray } from 'src/app/core/functions/enum-to-array';
import { TaskStatus } from 'src/app/core/enums/task-status';
import { KpiStatus } from 'src/app/core/enums/kpis-status';

@Component({
  selector: 'app-task-state-filter',
  standalone: true,
  templateUrl: './task-state-filter.component.html',
  styleUrls: ['./task-state-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, DropdownModule , TranslateModule]
})
export class TaskStatusFilterComponent {
  @Input() selectedValue: any; // Adjust type if necessary
  @Output() valueChanged = new EventEmitter<any>();
  @Input() classes = '';
  @Input() small = true;
  @Input() icon = true;
  @Input() kpis = false;
  @Input() filter = true;
  list :any[] = [];



  // list =  enumToArray(TaskStatus)
  constructor(){
    if(this.kpis){
      this.list = enumToArray(KpiStatus)
    }else{
      this.list = enumToArray(KpiStatus)
    }
  }

  onChange() {
    this.valueChanged.emit(this.selectedValue);
  }
}
