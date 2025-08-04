import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import {PackagesService} from "../../services/packages.service";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {SpaceConfigurationService} from "../../services/space-configuration.service";
import {SpacesService} from "../../services/super-admin/spaces.service";
import {AlertService} from "../../services/alert.service";
import {NgSelectModule} from "@ng-select/ng-select";
import {ArabicNumbersPipe} from "../../pipes/arabic-numbers.pipe";
import {ArabicDatePipe} from "../../pipes/arabic-date.pipe";
import {MatButtonModule} from "@angular/material/button";
import {SubmitButtonComponent} from "../submit-button.component";

@Component({
  selector: 'configure-space',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, NgSelectModule, MatDialogModule, ArabicNumbersPipe, ArabicDatePipe, MatButtonModule, SubmitButtonComponent],
  templateUrl: './configure-space.component.html',
  styleUrls: ['./configure-space.component.scss']
})
export class ConfigureSpaceComponent {
  space: any = this.data.space;
  loading = false;
  packages!: any[];
  form: FormGroup;
  total = 0;
  price = 0;
  numberOfEmployees = this.space.paymentSubscribtionTotalNumberOfUsers;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private packagesSer: PackagesService, public translate: TranslateService, private fb: FormBuilder, private service: SpaceConfigurationService, private spaceSer: SpacesService, private dialog: MatDialog, private alert: AlertService) {
    this.form = this.fb.group({
      package: [this.space.paymentPackageId, Validators.required]
    })
  }

  ngOnInit(): void {
    this.packagesSer.getPackages().subscribe((res: any) => this.packages = res)
  }

  add() {
    this.numberOfEmployees++;
    this.total = this.numberOfEmployees * this.price;
  }

  minus() {
    if (this.numberOfEmployees > this.space.numberOfActiveUser) {
      this.numberOfEmployees--;
      this.total = this.numberOfEmployees * this.price;
    }
  }

  submit() {
    let packageChanged = this.form.value.package != this.space.paymentPackageId;
    this.loading = true;
    const data = {
      // @ts-ignore
      ...(packageChanged && {paymentPackageId: this.form.value.package}),
      numberOfEmployees: packageChanged ? this.numberOfEmployees : (this.numberOfEmployees - this.space.paymentSubscribtionTotalNumberOfUsers),
    }
    // if package changed
    if (packageChanged) {
      this.service.updateSpacePackage(data, this.space.spaceId).subscribe((res: any) => {
        this.afterUpdate(res);
      });
    } else {
      this.service.updateNumberOfUsers(data, this.space.spaceId).subscribe((res: any) => {
        this.afterUpdate(res);
      });
    }
  }

  afterUpdate(res: any) {
    if (res.success) {
      this.alert.showAlert('space_updated')
      this.dialog.closeAll();
      this.spaceSer.getAllSpaces().subscribe()
    } else {
      this.loading = false
    }
  }

}
