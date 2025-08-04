import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {InputLabelComponent} from "../inputs/input-label.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputErrorComponent} from "../inputs/input-error.component";
import {MatButtonModule} from "@angular/material/button";
import {SpacesService} from "../services/spaces.service";
import {AlertService} from "../services/alert.service";
import {SubmitButtonComponent} from "./submit-button.component";

@Component({
  selector: 'join-space',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule, InputLabelComponent, ReactiveFormsModule, InputErrorComponent, MatButtonModule, SubmitButtonComponent],
  template: `
      <div class="join-space" dir="auto">
          <h3>{{'join_space' | translate}}</h3>
          <div mat-dialog-content>
              <form [formGroup]="form">
                  <input-label key="code" [control]="form.controls['code']"/>
                  <input type="text" formControlName="code" class="input">
                  <input-error [control]="form.controls['code']"/>
              </form>
          </div>
          <div mat-dialog-actions align="end">
              <button mat-raised-button mat-dialog-close>{{'cancel' | translate}}</button>
              <button mat-raised-button class="px-3" color="primary" (click)="join()" [disabled]="form.invalid || loading">
                  <submit-button text="join" [loading]="loading"/>
              </button>
          </div>
      </div>
  `,
  styles: []
})
export class JoinSpaceComponent {
  form!: FormGroup;
  service = inject(SpacesService)
  loading = false;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private alert: AlertService) {
    this.form = this.fb.group({
      code: ['', Validators.required]
    })
  }

  join() {
    this.loading = true;
    this.service.joinSpace(this.form.value.code).subscribe((res: any) => {
      if (res.success) {
        this.alert.showAlert('joined_space');
        this.service.getSpaces().subscribe();
        this.dialog.closeAll();
      } else {
        this.loading = false;
      }
    })
  }
}
