import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGroupChatComponent } from './create-group-chat.component';
import {MatDialogModule} from "@angular/material/dialog";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {SubmitButtonComponent} from "../submit-button.component";
import {InputLabelComponent} from "../../inputs/input-label.component";
import {InputErrorComponent} from "../../inputs/input-error.component";
import {SelectUserComponent} from "../select-user.component";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {UploadImageModule} from "../upload-image/upload-image.module";



@NgModule({
  declarations: [
    CreateGroupChatComponent
  ],
    imports: [
        CommonModule,
        MatDialogModule,
        TranslateModule,
        MatButtonModule,
        // UploadImageModule,
        ReactiveFormsModule,
        ArabicNumbersPipe,
        SubmitButtonComponent,
        InputLabelComponent,
        InputErrorComponent,
        SelectUserComponent,
        UploadImageModule
    ],
  exports: [
    CreateGroupChatComponent
  ]
})
export class CreateGroupChatModule { }
