import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecureRoutingModule } from './secure-routing.module';
import { SecureComponent } from './secure.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    SecureComponent
  ],
  imports: [
    TranslateModule,
    CommonModule,
    SecureRoutingModule,
    MatTooltipModule
  ]
})
export class SecureModule { }
