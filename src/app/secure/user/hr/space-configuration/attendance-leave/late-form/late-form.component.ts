import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AlertService } from 'src/app/core/services/alert.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LateRepetitionComponent } from './late-repetition/late-repetition.component';
import { InputErrorComponent } from 'src/app/core/inputs/input-error.component';

@Component({
  selector: 'app-late-form',
  templateUrl: './late-form.component.html',
  styleUrls: ['./late-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatButtonModule,
    TranslateModule,
    InputErrorComponent,
    LateRepetitionComponent,
  ]
})
export class LateFormComponent implements OnInit {
  form!: FormGroup;
  currentLang: string = '';
  existingTiers: any[] = [];
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alert: AlertService,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    // Get existing tiers from the parent component
    this.getExistingTiers();
    
    // Calculate the next available minsFrom value
    const nextMinsFrom = this.getNextAvailableMinsFrom();
    
    this.form = this.fb.group({
      id: [null],
      minsFrom: [nextMinsFrom, [Validators.required, Validators.min(0)]],
      minsTo: [null, [Validators.required, Validators.min(0)]],
      firstRepetitionsType: [ null],
      firstRepetitionsTypeValue: [0, [Validators.min(0)]],
      socondRepetitionsType: [null],
      socondRepetitionsTypeValue: [0, [Validators.min(0)]],
      thirdRepetitionsType: [null],
      thirdRepetitionsTypeValue: [0, [Validators.min(0)]],
      fourthRepetitionsType: [null],
      fourthRepetitionsTypeValue: [0, [Validators.min(0)]]
    });

    if (this.data.edit || this.data.view) {
      this.form.patchValue(this.data.data);
    } 
    // Listen for changes in minsFrom to update minsTo minimum
    this.form.get('minsFrom')?.valueChanges.subscribe(value => {
      this.updateMinsToMinimum(value);
    });
  }

  getExistingTiers() {
    // Get existing tiers from the parent component
    // This assumes the parent component passes the existing tiers in the data
    if (this.data.existingTiers) {
      this.existingTiers = this.data.existingTiers;
    } else {
      // If not provided, we'll assume empty for now
      this.existingTiers = [];
    }
  }

  getNextAvailableMinsFrom(): number {
    if (this.data.edit) {
      // If editing, return the current value
      return this.data.data?.minsFrom || 0;
    }
    
    if (this.existingTiers.length === 0) {
      // First tier starts from 0
      return 0;
    }
    
    // Find the highest minsTo value from existing tiers
    const maxMinsTo = Math.max(...this.existingTiers.map(tier => tier.minsTo || 0));
    
    // Next tier starts from the previous tier's minsTo + 1
    return maxMinsTo + 1;
  }

  get f() {
    return this.form.controls;
  }


  addToMinutes() {

    const currentValue = this.form.get('minsTo')?.value || 0;
      this.form.get('minsTo')?.setValue(currentValue + 1);
    
  }

  minusToMinutes() {
    const currentValue = this.form.get('minsTo')?.value || 0;
    if (currentValue > 0) {
      this.form.get('minsTo')?.setValue(currentValue - 1);
    }
  }

  submit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (formValue.minsTo <= formValue.minsFrom) {
        this.alert.showAlert('end_time_must_be_greater_than_start_time', 'error');
        return;
      }

      this.dialogRef.close(formValue);
    } else {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
    }
  }


  updateMinsToMinimum(minsFrom: number) {
    const minsTo = this.form.get('minsTo')?.value || 0;
    if (minsTo <= minsFrom) {
      // If current minsTo is less than or equal to new minsFrom, set it to minsFrom + 1
      this.form.get('minsTo')?.setValue(minsFrom + 1);
    }
  }
}
