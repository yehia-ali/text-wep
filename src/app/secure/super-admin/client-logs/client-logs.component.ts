import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { CreateWorkInfoComponent } from '../../user/hr/employee/forms-component/create-work-info/create-work-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { SpacesService } from 'src/app/core/services/super-admin/spaces.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MY_DATE_FORMATS } from '../../user/hr/employee/forms-component/create-file/create-file.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GetAttachmentsComponent } from "../../../core/components/get-attachments.component";
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'client-logs',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    GetAttachmentsComponent
],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe
  ],
  templateUrl: './client-logs.component.html',
  styleUrls: ['./client-logs.component.scss']
})
export class ClientLogsComponent {
  form: any;
  formData: any;
  selectedFile: any;
  currentDate = new Date()
  typelist: readonly any[] = [
    {name:'whatsapp'},
    {name:'call'},
    {name:'meeting'},
    {name:'email'},
    {name:'other'},
  ];
  constructor(
    private fb: FormBuilder,
    private datePipe : DatePipe ,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateWorkInfoComponent>,
    private alert:AlertService,
    private service:SpacesService,
  ) {
    this.form = this.fb.group({
      describtion : ['' ,Validators.required],
      type : ['' ,Validators.required],
      date : [''],
    });
    console.log(this.data)
    this.form.patchValue({
      type:this.data.type
    })
    this.form.patchValue({
      date:this.currentDate
    })
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      console.log(this.selectedFile)
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = new FormData(); // Use FormData to handle file uploads

      formData.append('spaceId',  this.data.space.id); 
      formData.append('describtion', this.form.get('describtion')?.value);
      formData.append('type', this.form.get('type')?.value);
      formData.append('date', this.datePipe.transform(this.form.get('date')?.value, 'yyyy-MM-dd') || '');

      if (this.selectedFile) {
        formData.append('filePath', this.selectedFile); // Append the selected file
      }

      this.service.createLog(formData).subscribe((res: any) => {
        if (res.success) {
          this.alert.showAlert('success');
          this.dialogRef.close();
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

}
