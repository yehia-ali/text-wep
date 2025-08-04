import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputNumbers]',
  standalone: true,
})
export class InputNumbersDirective {
  @Input() appInputNumbersMax: number; // الحد الأقصى
  @Input() appInputNumbersMin: number; // الحد الأدنى

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    const inputValue = this.el.nativeElement.value;

    // السماح بالمفاتيح الخاصة
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab','Control','a','c','v','x','z','y'];
    if (allowedKeys.includes(key)) {
      return; // السماح بهذه المفاتيح دون أي تحقق
    }

    // السماح فقط بالأرقام
    if (!/\d/.test(key)) {
      event.preventDefault();
      return;
    }

    // التحقق من الحد الأقصى والأدنى
    const newValue = inputValue + key;
    if (this.isValueInvalid(newValue)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const pastedText = (event.clipboardData || (window as any).clipboardData).getData('text');

    // التحقق من أن النص الملصق يحتوي على أرقام فقط
    if (!/^\d+$/.test(pastedText) || this.isValueInvalid(pastedText)) {
      event.preventDefault();
    }
  }

  private isValueInvalid(value: string): boolean {
    const numericValue = Number(value);
    return (
      isNaN(numericValue) ||
      (this.appInputNumbersMax !== undefined && numericValue > this.appInputNumbersMax) ||
      (this.appInputNumbersMin !== undefined && numericValue < this.appInputNumbersMin)
    );
  }
}
