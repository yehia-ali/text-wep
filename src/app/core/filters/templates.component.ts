import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {ProjectService} from '../servicess/project.service';
import {FormsModule} from "@angular/forms";
import {FilterLabelComponent} from "./filter-label.component";

@Component({
  selector: 'templates',
  standalone: true,
  imports: [CommonModule, NgSelectModule, TranslateModule, FormsModule, FilterLabelComponent,TranslateModule],
  template: `
    <div class="project-filter {{newFilter ? 'new-filter' : ''}}">
      <filter-label *ngIf="!hideLabel" key="project"/>
      <ng-select [placeholder]="placeholder | translate" class=" w-16r {{classes}}" [items]="projects$ | async" [(ngModel)]="selectedValue" (ngModelChange)="onChange()" bindLabel="title" bindValue="id" appendTo="body" [multiple]="true" [closeOnSelect]="false" [clearSearchOnAdd]="true">
        <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
          <span>{{ item.title | translate }}</span>
        </ng-template>
        <ng-template ng-multi-label-tmp let-items="items" let-clear="clear">
          <div class="ng-value flex aic">
                  <span class="ng-value-label">
                    <span class="flex aic fs-11">

                    <span *ngIf="items[0]?.title?.length >= 10">{{ items[0]?.title | translate | slice:0:10 }}...</span>
                    <span *ngIf="items[0]?.title?.length < 10">{{ items[0]?.title | translate }}</span>
                    </span>
                  </span>
            <span class="ng-value-icon right" (click)="clear(items[0])" aria-hidden="true">×</span>
          </div>
          <div class="ng-value rounded-2" *ngIf="items.length > 1">
            <span class="ng-value-label fs-11">{{ items.length - 1 }} {{ 'more' | translate }}...</span>
          </div>
        </ng-template>
      </ng-select>
      <span class="rounded-5 bg-primary count flex aic jcc fs-11 simibold white ml-50" *ngIf="newFilter && selectedValue.length > 0">
        {{selectedValue.length}}
      </span>
    </div>

  `,
  styles: []
})
export class TemplatesComponent {
  @Input() selectedValue = [];
  @Output() valueChanged = new EventEmitter();
  @Input() classes = '';
  @Input() placeholder = '';
  @Input() newFilter = false;
  @Input() clearData = false;
  @Input() hideLabel = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clearData'] && changes['clearData'].currentValue === true) {
      this.selectedValue = [];
      this.onChange(); // Emit the change to inform the parent component
    }
  }

  projects$ = this.projectsSer.projects;

  constructor(private projectsSer: ProjectService) {
  }

  ngOnInit(): void {
    if (this.projectsSer.projects.value.length == 0) {
      this.projectsSer.getProjects().subscribe()
    }
  }

  onChange() {
    this.valueChanged.emit(this.selectedValue)
  }
}
