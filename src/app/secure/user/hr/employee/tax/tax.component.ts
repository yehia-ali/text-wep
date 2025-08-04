import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UploadImageModule } from "../../../../../core/components/upload-image/upload-image.module";
import { InputLabelComponent } from "../../../../../core/inputs/input-label.component";
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'tax',
  templateUrl: './tax.component.html',
  standalone:true,
  styleUrls: ['./tax.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, // Import MatNativeDateModule
    UploadImageModule,
    InputLabelComponent,
    TranslateModule,
    NgSelectModule,
    FormsModule
  ],
})
export class TaxComponent {
isAdmin: boolean;
ganders: readonly any[]|null;
updateImage($event: any) {
throw new Error('Method not implemented.');
}
company: any;

}
