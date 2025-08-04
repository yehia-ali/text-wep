import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {PublicUserProfileService} from "../../../../../core/services/public-user-profile.service";
import {InputErrorComponent} from "../../../../../core/inputs/input-error.component";
import {InputLabelComponent} from "../../../../../core/inputs/input-label.component";
import {MonthFilterComponent} from "../../../../../core/filters/month-filter.component";

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG'
} else {
  local = 'en-GB';
}

@Component({
  selector: 'certification-form',
  standalone: true,
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: local},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  imports: [CommonModule, MatDialogModule, TranslateModule, FormsModule, ReactiveFormsModule, InputErrorComponent, MatCheckboxModule, MatDatepickerModule, MatButtonModule, InputLabelComponent, MonthFilterComponent],
  templateUrl: './certification-form.component.html',
  styleUrls: ['./certification-form.component.scss']
})
export class CertificationFormComponent implements OnInit {
  form: FormGroup;
  certificateImage: any;
  selectedImage: any;
  today = new Date()

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private service: PublicUserProfileService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      issueDate: [this.today, Validators.required],
      issueOrganizationName: ['', Validators.required],
    })
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    if (this.data.isEdit) {
      this.form.patchValue(this.data.data);
      this.selectedImage = this.data.data.imageUrl;
    }
  }

  getDate(date: any) {
    this.form.patchValue({issueDate: date});
  }

  submit() {
    if (this.form.valid) {
      let data = {
        ...this.form.value,
        issueDate: new Date(new Date(this.form.value.issueDate).setUTCHours(12, 0, 0, 0)),
      }
      if (this.data.isEdit) {
        this.service.updateCertificate({...data, id: this.data.data.id}, this.certificateImage).subscribe();
      } else {
        this.service.addCertificate(data, this.certificateImage).subscribe();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  fileChanged(file: any) {
    let formData = new FormData();
    let image = file.target.files[0];
    formData.append('uploadedFile', image);
    this.certificateImage = formData;
    this.selectedImage = image.name;
  }

  removeSelectedFile() {
    this.certificateImage = null;
    this.selectedImage = '';
  }
}
