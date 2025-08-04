import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appSafeHtml]',
  standalone: true
})
export class SafeHtmlDirective implements OnChanges {
  @Input() appSafeHtml: string = '';

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    this.el.nativeElement.innerHTML = this.appSafeHtml;
  }
}
