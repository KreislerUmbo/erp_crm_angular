import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input') onInput() {
    const inputElement = this.el.nativeElement;
    inputElement.value = inputElement.value.toUpperCase();
  }
}
