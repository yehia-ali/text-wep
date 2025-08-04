import {Directive, ElementRef, HostBinding, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[magicScroll]',
  standalone: true
})
export class MagicScrollDirective implements OnInit{

  @Input('magicScroll') magicScroll: any = 6;

  @HostBinding('style.overflow') overflow: string = 'auto';
  @HostBinding('style.height') height: any;

  constructor(private ele: ElementRef) { }

  ngOnInit(): void {
    this.ele.nativeElement.classList.add('scrolling');
    this.height = this.magicScroll + ' !important';
  }
}
