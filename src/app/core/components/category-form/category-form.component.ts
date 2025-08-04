import {Component, Inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AlertService} from "../../services/alert.service";
import {TemplatesService} from "../../services/templates.service";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {SubmitButtonComponent} from "../submit-button.component";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'category-form',
  standalone: true,
  imports: [CommonModule, MatDialogModule, InputLabelComponent, InputErrorComponent, ReactiveFormsModule, SubmitButtonComponent, MatButtonModule, TranslateModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  submitted = false;
  form: FormGroup;
  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private templatesService: TemplatesService, private alert: AlertService, private dialog: MatDialog) {

    this.form = this.fb.group({
      name: ['', Validators.required],
      arName: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    if (this.data.formType == 'edit') {
      this.form.patchValue(this.data.category)
    }
  }

  submit() {
    this.submitted = true;
    this.loading = true;
    if (this.form.valid) {
      if (this.data.formType == 'create') {
        this.templatesService.addCategory(this.form.value).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('category_created');
            this.templatesService.getCategories().subscribe(() => this.templatesService.loading.next(false))
            this.dialog.closeAll();
          } else {
            this.loading = false;
          }
        })
      } else {
        const data = {
          ...this.form.value,
          id: this.data.category.id
        }
        this.templatesService.updateCategory(data).subscribe((res: any) => {
          if (res.success) {
            this.alert.showAlert('category_updated');
            this.templatesService.getCategories().subscribe(() => this.templatesService.loading.next(false))
            this.dialog.closeAll();
          } else {
            this.loading = false;
          }
        })
      }
    }
  }

  get f() {
    return this.form.controls;
  }
}
