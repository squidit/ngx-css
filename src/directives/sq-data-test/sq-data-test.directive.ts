import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';

/**
 * Directive to add or remove a 'data-test' attribute to an element.
 * This is useful for E2E testing to identify elements in the DOM.
 *
 * @example
 * <button [dataTest]="'submit-button'">Submit</button>
 */
@Directive({
  selector: '[dataTest]',
  standalone: true,
})
export class SqDataTestDirective {
  /**
   * Sets or removes the data-test attribute on the host element.
   * If a value is provided, the attribute is set; otherwise, it is removed.
   *
   * @param {string} value - The value to set for the data-test attribute.
   */
  @Input() set dataTest(value: string) {
    if (value) {
      this.renderer.setAttribute(this.el.nativeElement, 'data-test', value);
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'data-test');
    }
  }

  /**
   * Reference to the host element.
   */
  private el: ElementRef = inject(ElementRef);

  /**
   * Renderer service to safely manipulate DOM elements.
   */
  private renderer: Renderer2 = inject(Renderer2);
}
