import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {InputLabelComponent} from "../../inputs/input-label.component";

@Component({
  selector: 'repeat',
  standalone: true,
  imports: [CommonModule, NgSelectModule, TranslateModule, FormsModule, InputLabelComponent],
  templateUrl: './repeat.component.html',
  styleUrls: ['./repeat.component.scss']
})
export class RepeatComponent {
  @Output() valueChanged = new EventEmitter();
  @Input() selectedValue = null;
  repeatPeriods = [
    {name: this.translate.instant('daily'), id: 1},
    {name: this.translate.instant('weekly'), id: 2},
    {name: this.translate.instant('monthly'), id: 3},
    {name: this.translate.instant('yearly'), id: 4},
    {name: this.translate.instant('not_repeated'), id: 6},
    {name: this.translate.instant('stopped_repeat'), id: 7},
  ]

  constructor(private translate: TranslateService) {
  }

  changeValue($event: any) {
    this.valueChanged.emit($event);
  }

}
