import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {TranslateModule} from '@ngx-translate/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter,} from '@angular/material-moment-adapter';
import {InputLabelComponent} from "../../../../../core/inputs/input-label.component";
import {InputErrorComponent} from "../../../../../core/inputs/input-error.component";
import {PublicUserProfileService} from "../../../../../core/services/public-user-profile.service";

let dir = document.dir;
let local;
if (dir === 'rtl') {
  local = 'ar-EG'
} else {
  local = 'en-GB';
}

@Component({
  selector: 'work-experience-form',
  standalone: true,
  templateUrl: './work-experience-form.component.html',
  styleUrls: ['./work-experience-form.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: local},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  imports: [CommonModule, MatDialogModule, TranslateModule, FormsModule, ReactiveFormsModule, InputErrorComponent, MatCheckboxModule, MatDatepickerModule, MatButtonModule, InputLabelComponent]
})
export class WorkExperienceFormComponent implements OnInit {
  form: FormGroup;
  companyLogo!: any;
  selectedLogo!: any;
  today = new Date();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private userSer: PublicUserProfileService) {
    this.form = this.fb.group({
      jobTitle: ['', Validators.required],
      companyName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isPresent: [false, Validators.required]
    })
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    this.isPresentChanges();
    if (this.data.isEdit) {
      this.form.patchValue(this.data.data);
      this.selectedLogo = this.data.data.companyImageUrl;
    }
  }

  submit(close = true) {
    if (this.form.valid) {
      let data = {
        ...this.form.value,
        startDate: new Date(new Date(this.form.value.startDate).setUTCHours(24, 0, 0, 0)),
        endDate: this.form.value.endDate ? new Date(new Date(this.form.value.endDate).setUTCHours(24, 0, 0, 0)) : ''
      }
      if (this.data.isEdit) {
        this.userSer.updateWorkExperience({...data, id: this.data.data.id}, this.companyLogo).subscribe();
      } else {
        this.userSer.addWorkExperience(data, this.companyLogo, close).subscribe();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  saveAndAdd() {
    this.submit(false);
    if (this.form.valid) {
      this.form.reset();
    }
  }

  fileChanged(file: any) {
    let formData = new FormData();
    let image = file.target.files[0];
    formData.append('uploadedFile', image);
    this.companyLogo = formData;
    this.selectedLogo = image.name;
  }

  removeSelectedFile() {
    this.selectedLogo = '';
    this.companyLogo = null;
  }

  isPresentChanges() {
    this.form.controls['isPresent'].valueChanges.subscribe((value) => {
      setTimeout(() => {
        const endDateControl = this.form.get('endDate');
        if (value) {
          endDateControl!.clearValidators();
          endDateControl!.disable();
          endDateControl!.setValue('');
        } else {
          endDateControl!.setValidators([Validators.required]);
          endDateControl!.enable();
        }
        endDateControl!.updateValueAndValidity();
      });
    });
  }
}
