import { Directive, ElementRef, Output, EventEmitter, OnDestroy, Renderer2, Input, OnChanges, SimpleChanges } from '@angular/core'

@Directive({
  selector: '[clickOutside]',
})
export class SqClickOutsideDirective implements OnDestroy, OnChanges {
  @Input() clickOutsideEnabled = false
  @Output() public clickOutside = new EventEmitter()

  listener!: () => void

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clickOutsideEnabled']) {
      if (changes['clickOutsideEnabled'].currentValue) {
        this.createListener()
      } else if (typeof this.listener === 'function') {
        this.listener()
      }
    }
  }

  ngOnDestroy() {
    if (typeof this.listener === 'function') {
      this.listener()
    }
  }

  createListener() {
    this.listener = this.renderer.listen('window', 'click', ($event) => {
      const isClickedInside = this.elementRef.nativeElement.contains($event.target)
      if (!isClickedInside) {
        this.clickOutside.emit()
      }
    })
  }
}
