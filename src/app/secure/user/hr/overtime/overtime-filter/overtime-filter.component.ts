import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DateFilterComponent} from "src/app/core/filters/date-filter.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'overtime-filter',
    standalone: true,
    imports: [CommonModule, DateFilterComponent, TranslateModule],
    templateUrl: './overtime-filter.component.html',
    styleUrls: ['./overtime-filter.component.scss']
})
export class OvertimeFilterComponent {
    @Input() service: any;
    @Output() export = new EventEmitter();

    filter() {
        this.service.filter();
    }

}
