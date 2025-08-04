import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import {InputErrorComponent} from "../inputs/input-error.component";
import {InputLabelComponent} from "../inputs/input-label.component";
import {PublicUserProfileService} from "../services/public-user-profile.service";

@Component({
  selector: 'skills-form',
  standalone: true,
  template: `
      <div class="certification-form" dir="auto">
          <h3>{{'add_skill' | translate}}</h3>

          <div mat-dialog-content>
              <form [formGroup]="form">
                  <div class="w-100">
                      <input-label [control]="f['name']" key="name" [maxLength]="30"/>
                      <input type="text" formControlName='name' class="input" maxlength="30">
                      <input-error [control]="f['name']"/>
                  </div>
              </form>
          </div>
      </div>

      <div mat-dialog-actions align="end">
          <button mat-raised-button color="primary" type="submit" (click)="submit()" class="px-3">{{'save' | translate}}</button>
          <button mat-raised-button mat-dialog-close="" class="shadow-0 border border-dark px-2 ml-1">{{'cancel' | translate}}</button>
      </div>

  `,
  styles: [],
  imports: [CommonModule, MatDialogModule, FormsModule, ReactiveFormsModule, TranslateModule, MatButtonModule, InputErrorComponent, InputLabelComponent]
})
export class SkillsFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private service: PublicUserProfileService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.valid) {
      this.service.addSkill(this.form.value.name).subscribe();
    } else {
      this.form.markAllAsTouched();
    }
  }

  get f() {
    return this.form.controls;
  }

}
