import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'category-filter',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, TranslateModule],
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent  implements OnInit {
  @Input() categories: any = []
  @Input() selectedCategories = []
  @Output() emitChange = new EventEmitter<any>();
  ngOnInit(): void {
  }

  onChange() {
    this.emitChange.emit(this.selectedCategories);
  }
}
