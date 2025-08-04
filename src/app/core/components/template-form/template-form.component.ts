import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputLabelComponent } from '../../inputs/input-label.component';
import { InputErrorComponent } from '../../inputs/input-error.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';
import { MatButtonModule } from '@angular/material/button';
import { SubmitButtonComponent } from '../submit-button.component';
import { TemplateCategory } from '../../interfaces/template-category';
import { AlertService } from '../../services/alert.service';
import { TemplatesService } from '../../services/templates.service';
import { PriorityComponent } from '../priority.component';
import { MagicScrollDirective } from '../../directives/magic-scroll.directive';
import { TextEditorComponent } from '../text-editor.component';
import { CreateTaskTodoComponent } from '../create-task-todo.component';

@Component({
  selector: 'template-form',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    ReactiveFormsModule,
    InputLabelComponent,
    InputErrorComponent,
    NgSelectModule,
    AngularEditorModule,
    FormsModule,
    MatButtonModule,
    SubmitButtonComponent,
    PriorityComponent,
    MagicScrollDirective,
    TextEditorComponent,
    CreateTaskTodoComponent,
    FormsModule
  ],
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss'],
})
export class TemplateFormComponent implements OnInit {
  deleteStage(item: any) {
    this.stages = this.stages.filter((stage: any) => stage.id !== item.id || stage.name !== item.name);
  }
  selectedStage: any = null;
  form: FormGroup;
  submitted = false;
  loading = false;
  todo = '';
  todos: any[] = [];
  categories: TemplateCategory[] = [];
  priorities = [
    { value: 2, name: 'high' },
    { value: 1, name: 'medium' },
    { value: 0, name: 'low' },
  ];
  types = [
    { name: this.translate.instant('classic'), value: 1 },
    { name: this.translate.instant('meeting'), value: 4 },
    { name: this.translate.instant('location'), value: 5 },
    { name: this.translate.instant('kpi'), value: 6 },
    { name: this.translate.instant('competence'), value: 7 },
    { name: this.translate.instant('signature'), value: 8 },
  ];
  props: any[] = [];
  stageMode: boolean;
  templateServ: any;
  stages: any[] = [];
  addStage: any;
  stageTitle: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private alert: AlertService,
    private dialog: MatDialog,
    private elm: ElementRef,
    private service: TemplatesService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      taskGroupType: [1, Validators.required],
      description: ['', Validators.required],
      priority: [null, Validators.required],
      taskTemplateCategoryId: [null, Validators.required],
      definitionOfDone: [''],
    });
  }

  ngOnInit(): void {
    this.service.categories.subscribe((res) => (this.categories = res));
    if (this.data.template) {
      this.form.patchValue(this.data.template);
      this.todos = this.data.template.taskTemplateTodoList;
      this.props = this.data.template.templateTaskDynamicProperties;
      this.stages = this.data.template.stages;
      if (this.stages.length > 0) {
        this.selectedStage = this.stages[0].id || null
      }
    }
  }

  submit() {
    this.submitted = true;
    this.loading = true;
    if (this.form.valid) {
      let taskTemplateTodoList;
      if (this.data.formType == 'create') {
        taskTemplateTodoList = this.todos.map((todo) => {
          return {
            todoText: todo.todoText,
          };
        });
      } else {
        taskTemplateTodoList = this.todos;
      }

      let templateTaskDynamicProperties;
      if (this.data.formType == 'create') {
        templateTaskDynamicProperties = this.props.map((prop) => {
          return {
            ...prop,
          };
        });
      } else {
        templateTaskDynamicProperties = this.props;
      }
      let stages;
      if (this.data.formType == 'create') {
        stages = this.stages.map((stage) => {
          return {
            ...stage,
            editStage: false,
            id: String(stage.id || 0),
          };
        });
      } else {
        stages = this.stages;
      }

      // data to send
      const data = {
        ...this.form.value,
        taskTemplateTodoList,
        templateTaskDynamicProperties,
        stages,
        ...(this.data.formType == 'edit' && { id: this.data.template.id }),
      };
      if (this.data.formType == 'create') {
        this.service.addTemplate(data).subscribe((res: any) => {
          if (res.success) {
            this.dialog.closeAll();
            this.successMessage();
            this.service.getCategories().subscribe();
            this.service.getTemplates().subscribe();
          } else {
            this.loading = false;
          }
        });
      } else {
        this.service.updateTodo(data).subscribe((res: any) => {
          if (res.success) {
            this.dialog.closeAll();
            this.service.getTemplates().subscribe();
            this.alert.showAlert('template_updated');
          } else {
            this.loading = false;
          }
        });
      }
    }
  }

  deleteTodo(id: number) {
    this.service.deleteTodo(id).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('todo_deleted');
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  addTodo() {
    if (this.todo.trim()) {
      this.todos.push({ todoText: this.todo, id: 1 });
      if (this.data.formType == 'edit') {
        this.service
          .createTodo({
            todoText: this.todo,
            taskTemplateId: this.data.template.id,
          })
          .subscribe((res: any) => {
            if (res.success) {
              this.alert.showAlert('todo_created');
            }
          });
      }
      this.todo = '';
      // to scroll to the bottom of the list when adding a new todo
      setTimeout(() => {
        this.elm.nativeElement.querySelector('.mat-dialog-content').scrollTop =
          this.elm.nativeElement.querySelector(
            '.mat-dialog-content'
          ).scrollHeight;
      }, 0);
    }
  }

  removeTodo(todo: any, index: number) {
    this.todos = this.todos.filter((t: any, i: number) => i !== index);
    if (this.data.formType == 'edit') {
      this.deleteTodo(todo.id);
    }
  }
  getProps(props: any) {
    this.props = props;
    setTimeout(() => {
      this.elm.nativeElement.querySelector(
        '.mat-mdc-dialog-content'
      ).scrollTop = this.elm.nativeElement.querySelector(
        '.mat-mdc-dialog-content'
      ).scrollHeight;
    }, 0);
  }

  successMessage() {
    this.alert.showAlert('template_created');
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '100px',
    minHeight: '5rem',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'Quote',
        class: 'quoteClass',
      },
      {
        name: 'Title Heading',
        class: 'titleHead',
        tag: 'h1',
      },
    ],
  };

  onAddStagePress($event: any) {
    if ($event.key === 'Enter') {
      this.saveStage();
    }
  }

  saveStage() {
    const data = {
      name: this.stageTitle || 'stage ' + this.stages.length + 1,
      order: this.stages.length + 1,
    };
    this.stages = [...this.stages, data];
    this.stageTitle = null;
  }
}
