import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {PackagesService} from "../../../../core/services/packages.service";
import {AlertService} from "../../../../core/services/alert.service";
import {TranslateModule} from "@ngx-translate/core";
import {InputLabelComponent} from "../../../../core/inputs/input-label.component";
import {InputErrorComponent} from "../../../../core/inputs/input-error.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatButtonModule} from "@angular/material/button";
import {SubmitButtonComponent} from "../../../../core/components/submit-button.component";

@Component({
  selector: 'package-form',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule, ReactiveFormsModule, InputLabelComponent, InputErrorComponent, NgSelectModule, MatButtonModule, SubmitButtonComponent],
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.scss']
})
export class PackageFormComponent {
  form: FormGroup;
  loading = false;

  currencies = [
    {name: 'EGP', value: 1},
    {name: 'USD', value: 2}
  ]

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private service: PackagesService, private dialog: MatDialog, private alert: AlertService) {
    let _package = this.data?._package;
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      gracePeriod: ['', Validators.required],
      pricePerUser: ['', Validators.required],
      currencyId: [1, Validators.required],
      limitedNumberOfUser: ['', Validators.required]
    });
    if (_package) this.form.patchValue({
      ..._package,
      currencyId: _package.currencyId || 1,
    })
  }

  ngOnInit(): void {
  }

  submit() {
    this.loading = true;
    if (!this.data?.isEdit) {
      this.service.createPackage(this.form.value).subscribe((res: any) => {
        if (res.success) {
          this.service.getPackages().subscribe();
          this.dialog.closeAll();
          this.alert.showAlert('package_created')
        }
      })
    } else {
      this.service.updatePackage({...this.form.value, id: this.data._package?.id}).subscribe((res: any) => {
        if (res.success) {
          this.service.getPackages().subscribe();
          this.dialog.closeAll();
          this.alert.showAlert('package_updated')
        }
      })
    }
  }

  get f() {
    return this.form.controls;
  }

}
