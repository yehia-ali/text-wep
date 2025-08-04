import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {FilterLabelComponent} from "./filter-label.component";
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';

@Component({
  selector: 'search',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, FilterLabelComponent],
  template: `
    <div class="search relative  {{width}}">
      <filter-label key="search" *ngIf="!hideLabel"></filter-label>
      <div class="input-icon">
        <i class="bx bx-search"></i>
        <input *ngIf="newSearch" #inputElement type="text" class="input fs-11 {{classes}}" [(ngModel)]="key" [placeholder]="placeholder | translate" />
        <input *ngIf="!newSearch" type="text" class="input fs-11 {{classes}}" (input)="changeValue()" [(ngModel)]="key" [placeholder]="placeholder | translate" />
      </div>
    </div>
  `,
  styles: []
})
export class SearchComponent {
  @Output() valueChanged = new EventEmitter();
  @Input() key: string = '';
  @Input() hideLabel = false;
  @Input() newSearch = false;
  @Input() width = 'w-16r'
  @Input() classes = ''
  @Input() placeholder = 'search'
  constructor() {

  }

  changeValue() {
    this.valueChanged.emit(this.key);
  }
  search() {
    this.valueChanged.emit(this.key);
  }

  @ViewChild('inputElement') inputElement!: ElementRef;

  ngAfterViewInit() {
    if (this.newSearch && this.inputElement) {
      fromEvent(this.inputElement.nativeElement, 'input')
        .pipe(
          debounceTime(500), // Wait for 500ms pause in events
          distinctUntilChanged() // Only emit if value is different from previous value
        )
        .subscribe(() => {
          this.search();
        });
    }
  }

}
