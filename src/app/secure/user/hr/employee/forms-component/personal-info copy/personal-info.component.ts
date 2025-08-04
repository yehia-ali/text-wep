import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputLabelComponent } from "../../../../../../core/inputs/input-label.component";
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'personal-info',
  templateUrl: './personal-info.component.html',
  standalone: true,
  styleUrls: ['./personal-info.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Change 'en-GB' to your desired locale
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, // Import MatNativeDateModule
    InputLabelComponent,
    TranslateModule,
    NgSelectModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalInfoComponent {
  isAdmin: boolean;
  gander: any;
  ganders: any[] = [];
  company: any;
}
