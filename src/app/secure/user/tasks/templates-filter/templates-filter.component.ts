import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchComponent} from "../../../../core/filters/search.component";
import {CategoryFilterComponent} from "../../../../core/filters/category-filter/category-filter.component";
import {TemplatesService} from "../../../../core/services/templates.service";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'templates-filter',
  standalone: true,
  imports: [CommonModule, SearchComponent, CategoryFilterComponent, MatButtonModule, TranslateModule],
  templateUrl: './templates-filter.component.html',
  styleUrls: ['./templates-filter.component.scss']
})
export class TemplatesFilterComponent implements OnInit {
  @Input() counter: number = 0;
  @Output() emitChange = new EventEmitter<any>();
  @Output() manageCategory = new EventEmitter<any>();
  @Output() newTemplate = new EventEmitter<any>();
  timeOut: any;

  constructor(public service: TemplatesService) {
  }

  ngOnInit(): void {
  }

  filter(value?: string, key?: any) {
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.service.page.next(1);
      key?.next(value);
      this.emitChange.emit(value);
    }, 500);
  }
}
