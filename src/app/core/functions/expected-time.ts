import {ArabicNumbersPipe} from "../pipes/arabic-numbers.pipe";

export function ExpectedTime(group: any, time: number) {
  let arabicNumbers = ArabicNumbersPipe;
  if (time > 59) {
    let hours = Math.trunc(time / 60);
    group.expectedHours = arabicNumbers.prototype.transform(hours);
    if (time - (60 * hours)) {
      group.expectedMinutes = arabicNumbers.prototype.transform(time - (60 * hours))
    }
  } else {
    group.expectedHours = 0;
    group.expectedMinutes = arabicNumbers.prototype.transform(time);
  }
}
