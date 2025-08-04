import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputLabelComponent} from "../inputs/input-label.component";
import {FormsModule} from "@angular/forms";
import { TranslateModule } from '@ngx-translate/core';
import { PropertyTypes } from '../enums/propertyTypes';
import { enumToArray } from '../functions/enum-to-array';

@Component({
  selector: 'create-task-todo',
  standalone: true,
  imports: [CommonModule, InputLabelComponent, FormsModule, TranslateModule],
  template: `
      <input-label [optional]="true" key="{{label}}"></input-label>
      <div class="flex-grid gap-y-2" [ngClass]="{'mb-1': currentList.length > 0}">
          <div class="col-lg-6" *ngFor="let item of currentList; let i = index">
              <div class="todo p-1 bg-gray flex jcsb rounded">
                  <div class="text">{{item.name || item}}</div>
                  <div class="remove-todo danger pointer" (click)="removeItem(i)">
                      <i class='bx bx-x'></i>
                  </div>
              </div>
          </div>
      </div>

      <div class="flex aic jcsb gap-x-2 relative rounded">
          <!-- حقل النص -->
          <input
              type="text"
              class="input"
              (keyup.enter)="addTodo()"
              maxlength="100"
              [(ngModel)]="todo"
              [ngModelOptions]="{standalone: true}"
              placeholder="{{propsState ? ('question' | translate) : ''}}">

          <select
              class="input"
              *ngIf="propsState"
              [(ngModel)]="propType"
              [ngModelOptions]="{standalone: true}">
              <option value="" disabled>{{ 'answer_type' | translate }}</option>
              <option [value]="item.value" *ngFor="let item of propsValues">
                  {{ item.name | translate }}
              </option>
          </select>

          <!-- زر الإضافة -->
          <button
              type="button"
              class="clickable-btn add-todo flex-center bg-primary fs-20 white p-1 rounded"
              (click)="addTodo()">
              <i class='bx bx-plus'></i>
          </button>
      </div>
  `,
  styles: [`
    .input-container {
      overflow: hidden;

      input {
        padding-inline-end: 6.5rem;
      }

      .add-todo {
        position: absolute;
        top: 0;
        inset-inline-end: 0;
        height: 100%;
        width: 5rem;
      }
    }

    .remove-todo {
      position: relative;
      top: 3px;
    }
  `]
})
export class CreateTaskTodoComponent {
  @Input() label: any = 'todo_list';
  @Input() todos: any = [];
  @Input() props: any = [];
  @Input() propsState = false;
  @Output() todoAdded = new EventEmitter();

  todo = '';
  propsValues = enumToArray(PropertyTypes);
  selectedProp: any;
  propType: any = '';
  ngOnInit(): void {
    setTimeout(() => {
    }, 1000);
  }
  // اختيار القائمة بناءً على propsState
  get currentList() {
    return this.propsState ? this.props : this.todos;
  }

  addTodo() {
    if (this.todo.trim()) {
      if (this.propsState) {
        if(this.todo && this.propType){
          this.selectedProp = {
            name:this.todo,
            dataType:this.propType,
          }
          this.props.push(this.selectedProp || this.todo);
          this.selectedProp = '';
          this.propType = '';
          this.todo = '';
        }
      } else {
        this.todos.push(this.todo);
        this.todo = '';
      }
    }
    this.todoAdded.emit(this.propsState ? this.props : this.todos);
  }

  removeItem(index: number) {
    if (this.propsState) {
      this.props = this.props.filter((_:any, i:any) => i !== index);
    } else {
      this.todos = this.todos.filter((_:any, i:any) => i !== index);
    }
    this.todoAdded.emit(this.propsState ? this.props : this.todos);
  }
}
