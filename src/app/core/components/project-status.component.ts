import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'project-status',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    template: `
        <div [ngClass]="{'chip-light-danger': state == 4, 'chip-light-primary': state == 1, 'chip-light-success': state == 3, 'chip-light-canceled': state == 2}"
             class="chip rounded fs-13 text-center {{classes}}">
        <span *ngIf="state == 1">
            <span>{{'project_open' | translate}}</span>
        </span>
            <span *ngIf="state == 2">
            <span>{{'hold' | translate}}</span>
        </span>
            <span *ngIf="state == 3">
            <span>{{'project_completed' | translate}}</span>
        </span>
            <span *ngIf="state == 4">
            <span>{{'project_closed' | translate}}</span>
        </span>
        </div>

    `,
    styles: []
})
export class ProjectStatusComponent {
    @Input() state: any;
    @Input() classes = '';
}
