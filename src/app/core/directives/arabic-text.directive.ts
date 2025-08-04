import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appArabicText]',
  standalone: true,
})
export class ArabicTextDirective {
  @Input() appArabicTextMaxLength: number;
  @Input() appArabicTextAllowSpaces: boolean = true;
  @Input() appArabicTextAllowNumbers: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    const inputValue = this.el.nativeElement.value;

    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Control', 'a', 'c', 'v', 'x', 'z', 'y'];
    if (allowedKeys.includes(key)) {
      return;
    }

    if (key === ' ' && this.appArabicTextAllowSpaces) {
      return;
    }

    if (this.appArabicTextAllowNumbers && /\d/.test(key)) {
      return;
    }

    if (!this.isArabicCharacter(key)) {
      event.preventDefault();
      return;
    }

    if (this.appArabicTextMaxLength && inputValue.length >= this.appArabicTextMaxLength) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const pastedText = (event.clipboardData || (window as any).clipboardData).getData('text');

    if (!this.isValidArabicText(pastedText)) {
      event.preventDefault();
    }

    const currentValue = this.el.nativeElement.value;
    if (this.appArabicTextMaxLength && (currentValue.length + pastedText.length) > this.appArabicTextMaxLength) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event']) onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    let filteredValue = value;
    
    if (!this.appArabicTextAllowSpaces) {
      filteredValue = filteredValue.replace(/\s/g, '');
    }
    
    if (!this.appArabicTextAllowNumbers) {
      filteredValue = filteredValue.replace(/\d/g, '');
    }

    filteredValue = filteredValue.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g, '');

    if (this.appArabicTextMaxLength && filteredValue.length > this.appArabicTextMaxLength) {
      filteredValue = filteredValue.substring(0, this.appArabicTextMaxLength);
    }

    if (filteredValue !== value) {
      input.value = filteredValue;
    }
  }

  private isArabicCharacter(char: string): boolean {
    const arabicRanges = [
      '\u0600-\u06FF',
      '\u0750-\u077F',
      '\u08A0-\u08FF',
      '\uFB50-\uFDFF',
      '\uFE70-\uFEFF'
    ];
    
    const arabicRegex = new RegExp(`[${arabicRanges.join('')}]`);
    return arabicRegex.test(char);
  }

  private isValidArabicText(text: string): boolean {
    let pattern = '[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF';
    
    if (this.appArabicTextAllowSpaces) {
      pattern += '\\s';
    }
    
    if (this.appArabicTextAllowNumbers) {
      pattern += '\\d';
    }
    
    pattern += ']';
    
    const invalidCharsRegex = new RegExp(pattern);
    return !invalidCharsRegex.test(text);
  }
} 