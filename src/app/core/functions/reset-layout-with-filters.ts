import { ElementRef, inject } from "@angular/core";

// to reset the height fo the layout wish filters content
export function resetLayoutHeight() {
  // const elm = inject(ElementRef);
  // setTimeout(() => {
  //   let filters = elm.nativeElement.querySelector('.layout-with-filters .filters');
  //   if (filters) {
  //     let content = elm.nativeElement.querySelector('.layout-with-filters .content');
  //     let observer = new ResizeObserver(entries => {
  //       let filtersHeight = entries[0].contentRect.height
  //       content.style.height = `calc(100% - (${filtersHeight + 59}px)`;
  //     });
  //     observer.observe(filters);
  //   }
  // }, 100);
}