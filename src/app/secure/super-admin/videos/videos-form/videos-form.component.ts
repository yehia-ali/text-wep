import {Component, inject, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BidiModule} from "@angular/cdk/bidi";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {InputLabelComponent} from "../../../../core/inputs/input-label.component";
import {MatButtonModule} from "@angular/material/button";
import {SubmitButtonComponent} from "../../../../core/components/submit-button.component";
import {PageInfoService} from "../../../../core/services/page-info.service";

@Component({
  selector: 'videos-form',
  standalone: true,
  imports: [CommonModule, BidiModule, MatDialogModule, TranslateModule, ReactiveFormsModule, InputLabelComponent, MatButtonModule, SubmitButtonComponent],
  templateUrl: './videos-form.component.html',
  styleUrls: ['./videos-form.component.scss']
})
export class VideosFormComponent {
  service = inject(PageInfoService);
  dialog = inject(MatDialog);
  form: FormGroup;
  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.form = this.fb.group({
      id: [this.data.video.id],
      arLinkWeb: [this.data.video.arLinkWeb],
      enLinkWeb: [this.data.video.enLinkWeb],
      arLinkIos: [this.data.video.arLinkIos],
      enLinkIos: [this.data.video.enLinkIos],
      arLinkAndroid: [this.data.video.arLinkAndroid],
      enLinkAndroid: [this.data.video.enLinkAndroid]
    });
  }

  submit() {
    this.loading = true;
    this.service.updatePageInfo(this.form.value).subscribe((res: any) => {
      if (res.success) {
        this.loading = false;
        this.service.hasChanged.next(true);
        this.dialog.closeAll();
      }
    })
  }

  get f() {
    return this.form.controls;
  }
}
