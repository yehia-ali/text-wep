import {Component, computed, OnInit, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {CategoriesListService} from 'src/app/core/services/categories.service';
import {SubCategoryService} from 'src/app/core/services/sub-categories.service';
import {Currency, UserProfile} from 'src/app/core/interfaces/user-profile';
import {Observable} from 'rxjs';
import {InputLabelComponent} from "../../../../../../core/inputs/input-label.component";
import {InputErrorComponent} from "../../../../../../core/inputs/input-error.component";
import {ServiceCategory} from "../../../../../../core/interfaces/service-category";
import {PublicUserProfileService} from "../../../../../../core/services/public-user-profile.service";
import {TimeInputComponent} from "../../../../../../core/components/time-input.component";
import {CurrencyService} from 'src/app/core/services/currency.service';
import {ServiceSubCategory} from "../../../../../../core/interfaces/service-sub-category";

@Component({
  selector: 'edit-profile',
  standalone: true,
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule, FormsModule, ReactiveFormsModule, InputErrorComponent, MatSlideToggleModule, NgSelectModule, TimeInputComponent, InputLabelComponent, InputErrorComponent]
})
export class EditProfileComponent implements OnInit {
  categories: Signal<ServiceCategory[]> = computed(() => this.categorySer.categories());
  subCategories: ServiceSubCategory[] = [];
  currencies$: Observable<Currency> | any = this.currencySer.getCurrencies();
  loading = false;
  form: FormGroup;
  currencyId = 1;
  sessionHours = 0;
  sessionMinutes = 0;
  bufferHours = 0;
  bufferMinutes = 0;
  prevCategory: number = 0;
  language = localStorage.getItem('language') || 'en';

  constructor(private fb: FormBuilder, private service: PublicUserProfileService, public categorySer: CategoriesListService, public subCategorySer: SubCategoryService, private currencySer: CurrencyService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      jobTitle: ['', Validators.required],
      summary: ['', Validators.required],
      isPublic: ['', Validators.required],
      category: [null, Validators.required],
      serviceSubCategoryId: [null, Validators.required],
      sessionDuration: [0, Validators.required],
      bufferDuration: [0],
      sessionFees: [0, Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    let user: UserProfile = this.service.userProfile();
    this.categoryChanges();
    this.isPublic();
    this.form.patchValue({
      name: user.name,
      jobTitle: user.jobTitle || '',
      summary: user.summary || '',
      isPublic: user?.isPublic,
      category: user.serviceSubCategory?.serviceCategory?.id,
      serviceSubCategoryId: user.serviceSubCategoryId,
      sessionDuration: 0,
      bufferDuration: 0,
      sessionFees: user.sessionFees,
    });
    this.sessionHours = Math.floor(user.sessionDuration / 60);
    this.sessionMinutes = user.sessionDuration % 60;
    this.bufferHours = Math.floor(user.bufferDuration / 60);
    this.bufferMinutes = user.bufferDuration % 60;
    this.prevCategory = user.serviceSubCategory?.serviceCategory?.id;
    this.currencyId = user.currencyId || 1;
  }

  submit() {
    this.loading = true;
    if (this.form.valid) {
      let data = {
        ...this.form.value,
        currencyId: this.currencyId,
        sessionDuration: this.sessionHours * 60 + this.sessionMinutes,
        bufferDuration: this.bufferHours * 60 + this.bufferMinutes,
      }
      this.service.updateProfile(data).subscribe((res: any) => {
        if (res?.success) {
          this.service.getUserProfile().subscribe();
        } else {
          this.loading = false;
        }
      });
    }
  }

  isPublic() {
    this.form.controls['isPublic'].valueChanges.subscribe((value) => {
      if (!value) {
        this.form.get('sessionFees')!.clearValidators();
        this.form.get('sessionDuration')!.clearValidators();
        this.form.get('serviceSubCategoryId')!.clearValidators();
        this.form.get('category')!.clearValidators();
      } else {
        this.form.get('sessionFees')!.setValidators([Validators.required]);
        this.form.get('sessionDuration')!.setValidators([Validators.required]);
        this.form.get('serviceSubCategoryId')!.setValidators([Validators.required]);
        this.form.get('category')!.setValidators([Validators.required]);
      }
      this.form.get('sessionFees')!.updateValueAndValidity();
      this.form.get('sessionDuration')!.updateValueAndValidity();
      this.form.get('bufferDuration')!.updateValueAndValidity();
      this.form.get('serviceSubCategoryId')!.updateValueAndValidity();
      this.form.get('category')!.updateValueAndValidity();
      this.form.updateValueAndValidity();
    });
  }

  categoryChanges() {
    this.form.controls['category'].valueChanges.subscribe((value) => {
      this.getSubCategories(value);
      if (this.prevCategory != value) {
        this.form.controls['serviceSubCategoryId'].setValue(null);
        this.prevCategory = value;
      }
    });
  }

  getSubCategories(id: number) {
    if (id) {
      this.subCategorySer.getSubCategories(id).subscribe(res => this.subCategories = res);
    } else {
      this.subCategories = [];
      this.form.controls['serviceSubCategoryId'].setValue(null);
    }
  }
}
