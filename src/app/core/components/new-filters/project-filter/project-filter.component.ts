import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ProjectService } from 'src/app/core/servicess/project.service';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-filter',
  standalone: true,
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, DropdownModule , TranslateModule]
})
export class ProjectFilterComponent {
  @Input() selectedValue: any; // Adjust type if necessary
  @Output() valueChanged = new EventEmitter<any>();
  @Input() classes = '';
  @Input() small = true;
  @Input() icon = true;

  projects$ = this.projectsSer.projects; // Assuming this is a BehaviorSubject

  constructor(private projectsSer: ProjectService) { }

  ngOnInit(): void {
    // Fetch projects if none exist
    if (this.projectsSer.projects.value.length === 0) {
      this.projectsSer.getProjects().subscribe();
    }
  }

  onChange() {
    const data = this.selectedValue.id
    this.valueChanged.emit(data);
  }
}
