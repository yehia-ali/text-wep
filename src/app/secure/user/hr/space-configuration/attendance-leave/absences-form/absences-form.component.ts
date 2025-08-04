import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { InputErrorComponent } from 'src/app/core/inputs/input-error.component';
import { InputLabelComponent } from 'src/app/core/inputs/input-label.component';
@Component({
  selector: 'absences-form',
  templateUrl: './absences-form.component.html',
  styleUrls: ['./absences-form.component.scss'],
  standalone: true,
  imports: [
    InputLabelComponent,
    InputErrorComponent,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,  
  ]
})
export class AbsencesFormComponent implements OnInit {
  form: FormGroup;
  editMode = false;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AbsencesFormComponent>) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      firstRepetitionDiscount: new FormControl(''),
      secondRepetitionDiscount: new FormControl(''),
      thirdRepetitionDiscount: new FormControl(''),
      fourthRepetitionDiscount: new FormControl(''),
    });
  }

  get f() {
    return this.form.controls;
  }

  submit() {
    console.log(this.form.value);
  }

  cancel() {
    this.dialogRef.close();
  }
}
