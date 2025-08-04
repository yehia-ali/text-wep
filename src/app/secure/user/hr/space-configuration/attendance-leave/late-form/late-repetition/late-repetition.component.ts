import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { InputErrorComponent } from 'src/app/core/inputs/input-error.component';
import { InputLabelComponent } from 'src/app/core/inputs/input-label.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RepetitionType } from 'src/app/core/enums/repetition-type';

interface RepetitionOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-late-repetition',
  templateUrl: './late-repetition.component.html',
  styleUrls: ['./late-repetition.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, InputLabelComponent, InputErrorComponent, TranslateModule]
})
export class LateRepetitionComponent implements OnInit {
  translate = inject(TranslateService);
  @Input() form!: FormGroup;
  @Input() repetitionNumber!: number;
  @Input() placeholder!: string;
  @Input() label!: string;
  repetitionTypesList: RepetitionOption[] = [
    { label: this.translate.instant(RepetitionType.warning), value: 1 },
    { label: this.translate.instant(RepetitionType.minutes), value: 2 },
    { label: this.translate.instant(RepetitionType.hours), value: 3 },
    { label: this.translate.instant(RepetitionType.days), value: 4 }
  ];
  ngOnInit() {
    // Initialize form controls if needed
  }

  get repetitionControl(): FormControl {
    const controlName = this.repetitionNumber === 1 ? 'firstRepetitionsType' :
                       this.repetitionNumber === 2 ? 'socondRepetitionsType' :
                       this.repetitionNumber === 3 ? 'thirdRepetitionsType' :
                       'fourthRepetitionsType';
    const control = this.form.get(controlName);
    if (!control) {
      throw new Error(`Control ${controlName} not found`);
    }
    return control as FormControl;
  }

  get deductionControl(): FormControl {
    const controlName = this.repetitionNumber === 1 ? 'firstRepetitionsTypeValue' :
                       this.repetitionNumber === 2 ? 'socondRepetitionsTypeValue' :
                       this.repetitionNumber === 3 ? 'thirdRepetitionsTypeValue' :
                       'fourthRepetitionsTypeValue';
    const control = this.form.get(controlName);
    if (!control) {
      throw new Error(`Control ${controlName} not found`);
    }
    return control as FormControl;
  }

  get repetitionValue() {
    return this.repetitionControl?.value;
  }

} 