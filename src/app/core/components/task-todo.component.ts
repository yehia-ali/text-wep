import {Component, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TaskDetails} from "../interfaces/task-details";
import {TaskDetailsService} from "../services/task-details.service";
import {AlertService} from "../services/alert.service";
import {TranslateModule} from "@ngx-translate/core";
import {MatCheckboxModule} from "@angular/material/checkbox";

@Component({
  selector: 'task-todo',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCheckboxModule],
  template: `
    <div class="todo-list">
      <h4>{{'todo_list' | translate}}</h4>
      <div class="todos mt-1">
        <div class="todo-card px-2 py-1 bg-gray flex aic rounded w-100 mb-2" *ngFor="let todo of task.taskTodosList">
          <mat-checkbox color="primary" (change)="check(todo)" [disabled]="task.taskStateId != 3 || !task.isAssignee" [checked]="todo.isChecked">
            <p>{{todo.todoText}}</p>
          </mat-checkbox>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TaskTodoComponent {
  @Input() task!: TaskDetails;
  service = inject(TaskDetailsService);
  alert = inject(AlertService);

  ngOnInit(): void {
  }

  check(todo: any) {
    const data = {
      assigneeId: this.task.assigneeId,
      taskGroupTodoListId: todo.id,
      isChecked: !todo.isChecked
    }

    this.service.updateTodoList(data).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('task_updated');
      }
    })
  }
}
