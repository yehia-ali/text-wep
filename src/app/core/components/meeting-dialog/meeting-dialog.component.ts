import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {MeetingService} from "../../services/meeting.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {InputErrorComponent} from "../../inputs/input-error.component";

@Component({
  selector: 'meeting-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule, InputLabelComponent, FormsModule, ReactiveFormsModule, InputErrorComponent],
  templateUrl: './meeting-dialog.component.html',
  styleUrls: ['./meeting-dialog.component.scss']
})
export class MeetingDialogComponent {
  meetingSer = inject(MeetingService);
  router = inject(Router);
  dialog = inject(MatDialog);
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    })
  }

  submit() {
    if (this.form.valid) {
      this.meetingSer.meetingName$.next(this.form.value.name);
      this.router.navigate(['/meeting/meet']);
      this.dialog.closeAll();
    } else {
      this.form.markAllAsTouched();
    }
  }

}
