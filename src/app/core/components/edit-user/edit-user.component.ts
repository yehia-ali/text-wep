import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AllUser} from "../../interfaces/all-user";
import {environment} from "../../../../environments/environment";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AllUsersService} from "../../servicess/all-users.service";
import {AllTasksService} from "../../services/all-tasks.service";
import {AlertService} from "../../services/alert.service";
import {Router} from "@angular/router";
import {SelectUserComponent} from "../select-user.component";
import {UserImageComponent} from "../user-image.component";
import {NgxStarRatingModule} from "ngx-star-rating";
import {TranslateModule} from "@ngx-translate/core";
import {ArabicDatePipe} from "../../pipes/arabic-date.pipe";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {SubmitButtonComponent} from "../submit-button.component";
import {GlobalService} from "../../services/global.service";

@Component({
  selector: 'edit-user',
  standalone: true,
  imports: [CommonModule, UserImageComponent, NgxStarRatingModule, TranslateModule, ArabicDatePipe, MatTooltipModule, MatButtonModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, NgSelectModule, SubmitButtonComponent, MatDialogModule, FormsModule, SelectUserComponent],
  templateUrl: './edit-user.component.html',
  styles: []
})
export class EditUserComponent implements OnInit {
  user!: AllUser;
  rate!: number;
  form: FormGroup
  users: AllUser[] = []
  departments$ = this.globalSer.departments$;
  loading = false;
  env = environment.apiUrl
  currentUserId = localStorage.getItem('id');
  selectedManager!: any;
  userToShow!: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: AllUsersService, private tasksSer: AllTasksService, private fb: FormBuilder, private alertSer: AlertService, private dialog: MatDialog, private router: Router, private globalSer: GlobalService) {
    this.form = this.fb.group({
      name: [this.data.user.name, Validators.required],
      jobTitle: [this.data.user.jobTitle],
      email: [this.data.user.email],
      phoneNumber: [this.data.user.phoneNumber],
      departmentId: [this.data.user.departmentId || null],
      jobDescription: [this.data.user.jobDescription],

    })
  }

  ngOnInit(): void {
    this.user = this.data.user;
    this.userToShow = this.user.managerName;
    this.service.getRate(this.data.user?.id).subscribe((res: any) => this.rate = res.data.averageRate);
    this.selectedManager = [{name: this.user.managerName, id: this.user.managerId}]
  }

  updateUser() {
    this.loading = true;
    const data = {
      ...this.form.value,
      managerId: this.selectedManager[0].id,
      id: this.user.id
    }
    this.service.updateUser(data).subscribe((res: any) => {
        if (res.success) {
          this.alertSer.showAlert('user_updated')
          this.service.hasChanged.next(true);
          this.dialog.closeAll();
        }
        this.loading = false;
      }
    )
  }

  addCV($event: any) {
    let file = $event.target.files[0];
    const fileData = {
      filePath: `Khaled/Attachments${file.name}`,
      contentType: file.type,
      fileName: file.name,
      fileSize: file.size,
      fileType: 1,
    }
    let formData = new FormData();
    formData.append('uploadedFile', file);
    this.service.addUserCV(fileData, this.user.id).subscribe((res: any) => {
      if (res.success) {
        this.alertSer.showAlert('files_uploading', 'bg-primary', 500000000000000);
        this.service.uploadCV(formData, res.data.id, this.user.id).subscribe((res: any) => {
          if (res.success) {
            this.service.getUsers().subscribe()
            this.alertSer.showAlert('user_updated')
            this.dialog.closeAll();
          }
        })
      }
    });
  }

  activateAccount(active: boolean) {
    const data = {
      id: this.user.id,
      isActivated: active
    }
    this.service.activateAccount(data).subscribe((res: any) => {
        if (res.success) {
          this.alertSer.showAlert('user_status_changed')
          this.service.hasChanged.next(true);
          this.dialog.closeAll();
        }
      }
    )
  }

  inbox() {
    this.tasksSer.loading.next(true);
    this.dialog.closeAll()
    this.router.navigate(['/admin/tasks']);
    // this.tasksSer.resetValues()
    // this.tasksSer.assignee.next([this.user]);
    this.tasksSer.getTasks().subscribe();
  }

  get f() {
    return this.form.controls
  }

  sent() {
    this.tasksSer.loading.next(true);
    this.dialog.closeAll()
    this.router.navigate(['/admin/tasks']);
    // this.tasksSer.resetValues()
    // this.tasksSer.creator.next([this.user]);
    this.tasksSer.getTasks().subscribe();
  }

}
