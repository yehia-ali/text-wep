import {Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from "@angular/material/menu";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'task-actions',
  standalone: true,
  imports: [CommonModule, MatMenuModule, TranslateModule],
  template: `
      <div class="task-actions line-height">
          <button [matMenuTriggerFor]="menu" class="clickable-btn line-height" [dir]="dir">
              <i class='bx bx-dots-vertical-rounded fs-25'></i>
          </button>
          <mat-menu #menu="matMenu" xPosition="before">
              <button mat-menu-item (click)="reassignFun()" *ngIf="reassignVisible">{{'reassign' | translate}}</button>
              <button mat-menu-item (click)="editTask()" *ngIf="!isRepate && !taskDetails">{{'edit' | translate}}</button>
              <button mat-menu-item (click)="cancelFun()">{{'archive' | translate}}</button>
              <button mat-menu-item (click)="deleteFun()" *ngIf="taskState == 1 || taskState == 7 || !taskState">{{'delete' | translate}}</button>
          </mat-menu>
      </div>

  `,
  styles: [`
    .bx {
      width: 15px !important;
    }
  `]
})
export class TaskActionsComponent {
  @Output() reassign = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Input() reassignVisible = true;
  @Input() taskDetails = false;
  @Input() taskState!: any;
  @Input() isRepate: boolean = false;
  dir: any = document.dir;
  constructor() { }

  ngOnInit(): void {
  }

  reassignFun() {
    this.reassign.emit();
  }

  cancelFun() {
    this.cancel.emit();
  }

  deleteFun() {
    this.delete.emit();
  }

  editTask() {
    this.edit.emit();
  }

}
