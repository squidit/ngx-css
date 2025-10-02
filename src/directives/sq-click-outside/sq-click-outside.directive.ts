import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  OnDestroy,
  Renderer2,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
/**
 * Directive that emits an event when a click occurs outside of the bound element.
 *
 * @example
 * <!-- Add the clickOutside directive to an element and listen for the clickOutside event. -->
 * <div [clickOutside]="true" (clickOutside)="handleClickOutside()">
 *   <!-- Content here -->
 * </div>
 */
@Directive({
  selector: '[clickOutside]',
  standalone: true,
})
export class SqClickOutsideDirective implements OnDestroy, OnChanges {
  /**
   * Indicates whether the clickOutside functionality is enabled.
   */
  @Input() clickOutsideEnabled = false;

  /**
   * Event emitted when a click occurs outside of the bound element.
   */
  @Output() public clickOutside = new EventEmitter();

  /**
   * Listener function to handle click events.
   */
  listener!: () => void;

  /**
   * Constructs a new SqClickOutsideDirective.
   *
   * @param {ElementRef} elementRef - The ElementRef of the bound element.
   * @param {Renderer2} renderer - The Renderer2 for DOM manipulation.
   */
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  /**
   * Lifecycle hook that handles changes to the clickOutsideEnabled property.
   *
   * @param {SimpleChanges} changes - The changes to input properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clickOutsideEnabled']) {
      if (changes['clickOutsideEnabled'].currentValue) {
        this.createListener();
      } else if (typeof this.listener === 'function') {
        this.listener();
      }
    }
  }

  /**
   * Lifecycle hook that cleans up the directive when it is destroyed.
   */
  ngOnDestroy() {
    this.listener = () => null;
  }

  /**
   * Creates a click event listener to detect clicks outside of the bound element.
   */
  createListener() {
    this.listener = this.renderer.listen('window', 'click', $event => {
      const isClickedInside = this.elementRef.nativeElement.contains($event.target);
      if (!isClickedInside) {
        this.clickOutside.emit();
      }
    });
  }
}
