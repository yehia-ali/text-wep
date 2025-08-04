import {inject, Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";

@Injectable({
  providedIn: 'root'
})
export abstract class WorkingHoursService {
  translate = inject(TranslateService);
  arabicNumber = inject(ArabicNumbersPipe);
  protected constructor() {
  }

  workingHours(type: any, required: number, actual: number) {
    if (required > 59) {
      let hours = Math.trunc(required / 60);
      type.required = this.arabicNumber.transform(hours) + this.translate.instant('h');
      if (required - (60 * hours) > 0) {
        type.requiredMinutes = this.arabicNumber.transform(required - (60 * hours)) + this.translate.instant('m')
      }
    } else {
      type.required = this.arabicNumber.transform(required) + this.translate.instant('m');
    }
    if (actual > 59) {
      let hours = Math.trunc(actual / 60);
      type.actual = this.arabicNumber.transform(hours) + this.translate.instant('h');
      if (actual - (60 * hours) > 0) {
        type.actualMinutes = this.arabicNumber.transform(actual - (60 * hours)) + this.translate.instant('m')
      }
    } else {
      type.actual = this.arabicNumber.transform(actual) + this.translate.instant('m');
    }
    if (required > actual) {
      type.requiredPercentage = 100
      type.actualPercentage = ((actual / required) * 100).toFixed(1);
    } else if (actual > required) {
      type.requiredPercentage = ((required / actual) * 100).toFixed(1);
      type.actualPercentage = ((required / actual) * 100).toFixed(1);
      type.extraTimePercentage = 100 - +((required / actual) * 100).toFixed(1);
      let extraTime = actual - required;
      if (extraTime > 59) {
        let hours = Math.trunc(extraTime / 60);
        type.extraHours = this.arabicNumber.transform(hours) + this.translate.instant('h');
        if (extraTime - (60 * hours) > 0) {
          type.extraMinutes = this.arabicNumber.transform(extraTime - (60 * hours)) + this.translate.instant('m')
        }
      } else {
        type.extraHours = 0;
        type.extraMinutes = this.arabicNumber.transform(extraTime) + this.translate.instant('m');
      }

    } else if (actual == 0 && required == 0) {
      type.requiredPercentage = 0
      type.actualPercentage = 0
    } else {
      type.requiredPercentage = 100
      type.actualPercentage = 100
    }
  }
}
