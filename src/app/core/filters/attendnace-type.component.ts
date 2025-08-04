import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputLabelComponent} from "../inputs/input-label.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'attendnace-type',
    standalone: true,
    imports: [CommonModule, InputLabelComponent, NgSelectModule, FormsModule, TranslateModule],
    template: `
        <div class="transaction-type">
            <input-label key="transaction_type"/>
            <ng-select class="w-17" [items]="[{name: translate.instant('check-in'), value: 1}, {name: translate.instant('check-out'), value: 2}]" [(ngModel)]="selectedValue"
                       (ngModelChange)="onChange()"
                       bindLabel="name" bindValue="value" appendTo="body" [multiple]="false" [closeOnSelect]="true">
                <ng-template ng-option-tmp let-item="item" let-item$="item$" let-index="index">
                    {{item.name | translate}}
                </ng-template>
                <ng-template ng-label-tmp let-item="item" let-clear="clear">
                    <span class="fs-14">{{item.name | translate}}</span>
                </ng-template>
            </ng-select>
        </div>

    `,
    styles: []
})
export class AttendnaceTypeComponent {
    @Input() selectedValue: any;
    @Output() valueChanged = new EventEmitter<any>();

    constructor(public translate: TranslateService) {
    }

    ngOnInit(): void {
    }

    onChange() {
        this.valueChanged.emit(this.selectedValue);
    }
}
