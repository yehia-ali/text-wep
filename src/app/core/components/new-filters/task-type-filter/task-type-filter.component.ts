import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ProjectService } from 'src/app/core/servicess/project.service';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TaskType } from 'src/app/core/enums/task-type';
import { enumToArray } from 'src/app/core/functions/enum-to-array';

@Component({
  selector: 'app-task-type-filter',
  standalone: true,
  templateUrl: './task-type-filter.component.html',
  styleUrls: ['./task-type-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, DropdownModule , TranslateModule]
})
export class TaskTypeFilterComponent {
  @Input() selectedValue: any; // Adjust type if necessary
  @Output() valueChanged = new EventEmitter<any>();
  @Input() classes = '';
  @Input() small = true;
  @Input() icon = true;



  list = enumToArray(TaskType);

  onChange() {
    this.valueChanged.emit(this.selectedValue);
  }
}
