import {OwlDateTimeIntl} from "@danielmoncada/angular-datetime-picker";

export class DefaultIntl extends OwlDateTimeIntl {
  /** A label for the up second button (used by screen readers).  */
  lang = localStorage.getItem('language') || 'en';
  /** A label for the cancel button */
  override cancelBtnLabel = this.lang == 'ar' ? 'الغاء' : 'Cancel';

  /** A label for the set button */
  override setBtnLabel = this.lang == 'ar' ? 'حفظ' : 'Set'
  override rangeFromLabel = this.lang == 'ar' ? 'من' : 'From '
  override rangeToLabel = this.lang == 'ar' ? 'الي' : 'To '
}
