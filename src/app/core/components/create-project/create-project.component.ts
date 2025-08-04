import {Component, Inject, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MagicScrollDirective} from "../../directives/magic-scroll.directive";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {SubmitButtonComponent} from "../submit-button.component";
import {OwlDateTimeModule} from "@danielmoncada/angular-datetime-picker";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {PriorityComponent} from "../priority.component";
import {enumToArray} from "../../functions/enum-to-array";
import {Priority} from "../../enums/priority";
import {SelectUserComponent} from "../select-user.component";
import {AngularEditorConfig, AngularEditorModule} from "@kolkov/angular-editor";
import {ProjectService} from "../../servicess/project.service";
import {AlertService} from "../../services/alert.service";
import {Project} from "../../interfaces/project";
import { CreateWorkInfoComponent } from 'src/app/secure/user/hr/employee/forms-component/create-work-info/create-work-info.component';

@Component({
    selector: 'create-project',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MagicScrollDirective, TranslateModule, MatButtonModule, SubmitButtonComponent, OwlDateTimeModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, NgSelectModule, PriorityComponent, SelectUserComponent, AngularEditorModule],
    templateUrl: './create-project.component.html',
    styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
    form!: FormGroup;
    loading = false;
    priorities = enumToArray(Priority);
    now = new Date(new Date().setMinutes(new Date().getMinutes() + 5));
    selectedMembers: any = [];
    service = inject(ProjectService);
    alert = inject(AlertService);
    dialog = inject(MatDialog);

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder , private dialogRef: MatDialogRef<CreateWorkInfoComponent>,) {
        let project: Project = data?.project;
        this.form = this.fb.group({
            title: [project?.title || "", [Validators.required, Validators.maxLength(100)]],
            priority: [String(project?.priority) || null, Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            description: [project?.description || ""],
            definitionOfDone: [project?.definitionOfDone || ""],
        });
        if (data?.edit) {
            this.f['startDate'].removeValidators(Validators.required);
            this.form.patchValue({
                startDate: new Date(project.endDate),
            })
            this.form.updateValueAndValidity();
            this.selectedMembers = [0]
        }
    }

    submit() {
        if (this.form.valid) {
            this.loading = true;
            let data;
            if (this.data?.edit) {
                let project = this.data.project;
                data = {
                    projectState: project.projectState,
                    id: project.id,
                    title: this.form.value.title,
                    priority: this.form.value.priority,
                    description: this.form.value.description,
                    definitionOfDone: this.form.value.definitionOfDone,
                    endDate: this.form.value.endDate,
                }
                this.service.editProject(data).subscribe((res: any) => {
                    if (res.success) {
                        this.alert.showAlert('project_updated');
                        this.dialogRef.close(true);
                        this.service.getProjects().subscribe()
                    }
                })
            } else {
                data = {
                    ...this.form.value,
                    projectState: 1,
                    projectMembers: this.selectedMembers.map((user: any) => {
                        return {memberId: user.id}
                    }),
                }
                this.service.createProject(data).subscribe((res: any) => {
                    if (res.success) {
                        this.alert.showAlert('project_created');
                        this.dialogRef.close(true);
                        this.service.getProjects().subscribe()
                    }
                })
            }

        } else {
            this.form.markAllAsTouched();
        }
    }

    get f() {
        return this.form.controls;
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
}
