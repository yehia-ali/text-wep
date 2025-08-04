import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {enumToArray} from "../functions/enum-to-array";
import {FormsModule} from "@angular/forms";
import {FilterLabelComponent} from "./filter-label.component";
import {SessionStatus} from "../enums/session-status";

@Component({
    selector: 'session-status-filter',
    standalone: true,
    imports: [CommonModule, NgSelectModule, FormsModule, FilterLabelComponent],
    template: `
        <div class="session-status">
            <filter-label key="status"/>
            <ng-select class="w-20r" [items]="allStatus" bindLabel="name" bindValue="value" [(ngModel)]="key" (ngModelChange)="changeValue()">
            </ng-select>
        </div>
    `,
    styles: []
})
export class SessionStatusFilterComponent {
    @Output() valueChanged = new EventEmitter();
    @Input() key: any = null;
    allStatus = enumToArray(SessionStatus).filter((item: any) => item.value != SessionStatus.rejected);

    changeValue() {
        this.valueChanged.emit(this.key);
    }
}
