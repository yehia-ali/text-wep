import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appEnglishText]',
  standalone: true,
})
export class EnglishTextDirective {
  @Input() appEnglishTextMaxLength: number;
  @Input() appEnglishTextAllowSpaces: boolean = true;
  @Input() appEnglishTextAllowNumbers: boolean = false;
  @Input() appEnglishTextAllowSpecialChars: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    const inputValue = this.el.nativeElement.value;

    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Control', 'a', 'c', 'v', 'x', 'z', 'y'];
    if (allowedKeys.includes(key)) {
      return;
    }

    if (key === ' ' && this.appEnglishTextAllowSpaces) {
      return;
    }

    if (this.appEnglishTextAllowNumbers && /\d/.test(key)) {
      return;
    }

    if (this.appEnglishTextAllowSpecialChars && this.isSpecialCharacter(key)) {
      return;
    }

    if (!this.isEnglishCharacter(key)) {
      event.preventDefault();
      return;
    }

    if (this.appEnglishTextMaxLength && inputValue.length >= this.appEnglishTextMaxLength) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const pastedText = (event.clipboardData || (window as any).clipboardData).getData('text');

    if (!this.isValidEnglishText(pastedText)) {
      event.preventDefault();
    }

    const currentValue = this.el.nativeElement.value;
    if (this.appEnglishTextMaxLength && (currentValue.length + pastedText.length) > this.appEnglishTextMaxLength) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event']) onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    let filteredValue = value;
    
    if (!this.appEnglishTextAllowSpaces) {
      filteredValue = filteredValue.replace(/\s/g, '');
    }
    
    if (!this.appEnglishTextAllowNumbers) {
      filteredValue = filteredValue.replace(/\d/g, '');
    }

    if (!this.appEnglishTextAllowSpecialChars) {
      filteredValue = filteredValue.replace(/[^a-zA-Z\s]/g, '');
    } else {
      filteredValue = filteredValue.replace(/[^a-zA-Z\s\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');
    }

    if (this.appEnglishTextMaxLength && filteredValue.length > this.appEnglishTextMaxLength) {
      filteredValue = filteredValue.substring(0, this.appEnglishTextMaxLength);
    }

    if (filteredValue !== value) {
      input.value = filteredValue;
    }
  }

  private isEnglishCharacter(char: string): boolean {
    return /^[a-zA-Z]$/.test(char);
  }

  private isSpecialCharacter(char: string): boolean {
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    return specialChars.includes(char);
  }

  private isValidEnglishText(text: string): boolean {
    let pattern = '[^a-zA-Z';
    
    if (this.appEnglishTextAllowSpaces) {
      pattern += '\\s';
    }
    
    if (this.appEnglishTextAllowNumbers) {
      pattern += '\\d';
    }
    
    if (this.appEnglishTextAllowSpecialChars) {
      pattern += '!@#$%^&*()_+\\-=\\[\\]{}|;:,.<>?';
    }
    
    pattern += ']';
    
    const invalidCharsRegex = new RegExp(pattern);
    return !invalidCharsRegex.test(text);
  }
} 