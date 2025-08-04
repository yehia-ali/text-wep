import { Component, Inject } from '@angular/core';
import { UploadImageModule } from "../../../../../../core/components/upload-image/upload-image.module";
import { InputLabelComponent } from "../../../../../../core/inputs/input-label.component";
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GetAttachmentsComponent } from "../../../../../../core/components/get-attachments.component";
import { HrEmployeesService } from 'src/app/core/services/hr-employees.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AlertService } from 'src/app/core/services/alert.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'create-file',
  templateUrl: './create-file.component.html',
  standalone: true,
  styleUrls: ['./create-file.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Change 'en-GB' to your desired locale
    { provide: DateAdapter, useClass: MomentDateAdapter },  // If using Moment.js
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    UploadImageModule,
    InputLabelComponent,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    GetAttachmentsComponent,
    ReactiveFormsModule
  ]
})
export class CreateFileComponent {

  form: FormGroup;
  allusers: any;
  filesType: any;
  attachments: any;
  searchValue: any;
  selectedUser: any;
  totalItems: any;
  selectedFile: any;
  isAdmin: boolean;
  gander: any;
  ganders: any[] = [];
  company: any;
  
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private service: HrEmployeesService,
    private alert : AlertService,
    private dialogRef: MatDialogRef<CreateFileComponent>,

  ) {
    // Initialize the form with form controls
    this.form = this.fb.group({
      profileId: ['', Validators.required],
      fileTypeId: ['', Validators.required],
      name: ['', Validators.required],
      fileNum: ['', Validators.required],
      description: ['', Validators.required],
      issuingDate: ['', Validators.required],
      expireDate: ['', Validators.required],
      file: [''],
    });
  }

  ngOnInit(): void {
    this.getSpaceUsers();
    this.defultSelectedUser();
    this.getFilesType();
    this.selectedFile = this.data.id;
  }

  defultSelectedUser() {
    if (localStorage.getItem('selectedUser')) {
      let storedUser: any = localStorage.getItem('selectedUser');
      let convertedUser = JSON.parse(storedUser);
      this.selectedUser = convertedUser.id;
      this.form.patchValue({
        profileId: this.selectedUser,
      });
      this.searchValue = this.selectedUser;
      this.getSpaceUsers();
    }
  }

  getFilesType() {
    this.service.getFilesType().subscribe((res: any) => {
      this.filesType = res.data;
    });
  }

  getSpaceUsers() {
    let params: any = {
      limit: 30,
      search: this.searchValue,
    };
    this.service.getUsers(params).subscribe((res: any) => {
      this.allusers = res.data.items;
      this.totalItems = res.data.totalItems;
    });
  }

  usersSearch(event: any) {
    this.searchValue = event.term;
    this.getSpaceUsers();
  }

  uploadImages($event: any) {
    this.attachments = $event;
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('profileId', this.form.get('profileId')?.value);
      formData.append('fileTypeId', this.form.get('fileTypeId')?.value);
      formData.append('name', this.form.get('name')?.value);
      formData.append('description', this.form.get('description')?.value);
      formData.append('fileNum', this.form.get('fileNum')?.value);
      // Format dates to YYYY-MM-DD
      const issuingDate = this.formatDate(this.form.get('issuingDate')?.value);
      const expireDate = this.formatDate(this.form.get('expireDate')?.value);

      formData.append('issuingDate', issuingDate);
      formData.append('expireDate', expireDate);

      if (this.attachments && this.attachments.length > 0) {
        for (let i = 0; i < this.attachments.length; i++) {
          formData.append('file', this.attachments[i], this.attachments[i].name);
        }
      }

      this.service.createFile(formData).subscribe((res: any) => {
        if(res.success){
          this.dialogRef.close(true);
          this.alert.showAlert('file_created')
        }else{
          this.alert.showAlert(res.error)
        }
      });
    }
  }
  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  close() {
    this.dialog.closeAll();
  }

}
