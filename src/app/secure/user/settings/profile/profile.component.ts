import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {User} from "../../../../core/interfaces/user";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {environment} from "../../../../../environments/environment";
import {UserService} from "../../../../core/services/user.service";
import {AlertService} from "../../../../core/services/alert.service";
import {UploadImageModule} from "../../../../core/components/upload-image/upload-image.module";
import {InputLabelComponent} from "../../../../core/inputs/input-label.component";
import {InputErrorComponent} from "../../../../core/inputs/input-error.component";
import {SubmitButtonComponent} from "../../../../core/components/submit-button.component";
import {TranslateModule} from "@ngx-translate/core";
import {LayoutComponent} from "../../../../core/components/layout.component";
import {MagicScrollDirective} from "../../../../core/directives/magic-scroll.directive";
import { UserWithImageComponent } from "../../../../core/components/user-with-image/user-with-image.component";
import { RolesService } from 'src/app/core/services/roles.service';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CommonModule, UploadImageModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, SubmitButtonComponent, TranslateModule, LayoutComponent, MagicScrollDirective, UserWithImageComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  rolesService = inject(RolesService);
  isAdmin = false;
  user!: User;
  spaceId = localStorage.getItem('space-id');
  form: FormGroup;
  loading = false;
  env = environment.apiUrl;

  constructor(private service: UserService, private userSer: UserService, private alertSer: AlertService, private fb: FormBuilder) {
    // this.form = this.fb.group({
    //   name: ["", Validators.required],
    //   jobTitle: ["", Validators.required],
    //   email: ["", [Validators.required, Validators.email]],
    //   phoneNumber: [""],
    //   jobDescription: [""],
    // })

    this.form = this.fb.group({
      name: [{ value: '' }, Validators.required],
      jobTitle: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: [{ value: '', disabled: true }],
      jobDescription: [{ value: '' }]
    });

  }

  ngOnInit(): void {
    this.rolesService.canAccessAdmin.subscribe(res => {
      this.isAdmin = res;
    })

    this.userSer.user$.subscribe(res => {
      this.user = res;
      if (res) {
        this.form.patchValue({
          name: res.name,
          jobTitle: res.jobTitle,
          email: res.email,
          phoneNumber: res.phoneNumber,
          jobDescription: res.jobDescription,
        })
      }
    })
  }

  updateImage($event: any) {
    this.alertSer.showAlert('file_uploading', 'bg-primary', 5000000);
    let formData = new FormData();
    formData.append("uploadedFile", $event);
    this.service.updateImage(formData).subscribe((res: any) => {
      if (res.success) {
        this.alertSer.showAlert('profile_updated');
        this.userSer.getMyProfile(this.spaceId).subscribe()
      }
    })
  }

  submit() {
    this.loading = true;
    this.service.updateProfile(this.form.value).subscribe((res: any) => {
      if (res.success) {
        this.alertSer.showAlert('profile_updated');
        this.userSer.getMyProfile(this.spaceId).subscribe()
      }
      this.loading = false;
    });
  }

  get f() {
    return this.form.controls
  }
}
