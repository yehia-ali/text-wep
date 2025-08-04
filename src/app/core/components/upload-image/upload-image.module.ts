import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadImageComponent } from './upload-image.component';
import {MatMenuModule} from "@angular/material/menu";
import {TranslateModule} from "@ngx-translate/core";
import {UserImageComponent} from "../user-image.component";



@NgModule({
  declarations: [
    UploadImageComponent
  ],
    imports: [
        CommonModule,
        MatMenuModule,
        TranslateModule,
        UserImageComponent
    ],
  exports: [
    UploadImageComponent
  ]
})
export class UploadImageModule { }
