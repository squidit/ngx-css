import { AfterContentChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core'

@Component({
  selector: 'sq-infinity-scroll',
  templateUrl: './sq-infinity-scroll.component.html',
  styleUrls: ['./sq-infinity-scroll.component.scss']
})
export class SqInfinityComponent implements AfterViewInit, AfterContentChecked, OnDestroy {
  @ViewChild('scroll', { static: true }) scrollElement?: ElementRef
  @Input() length = 0
  @Input() endMessage?: string
  @Input() hasMore?: boolean | string = true
  @Input() loading?: boolean
  @Input() loaderColor?: string
  @Input() elementToScrollId?: string
  @Output() scrolledEmitter: EventEmitter<void> = new EventEmitter()

  /* Local Variables */
  elementToScroll?: HTMLElement | null | Window & typeof globalThis
  /* Local Variables */



  ngAfterViewInit(): void {
    const { elementToScrollId } = this

    if (elementToScrollId) {
      this.elementToScroll = document.getElementById(elementToScrollId)
    }

    if (!elementToScrollId || !this.elementToScroll) {
      this.elementToScroll = window
    }
    this.elementToScroll.addEventListener('scroll', this.onScroll, false)
  }

  ngAfterContentChecked(): void {
    if (this.elementToScrollId && this.elementToScroll && this.elementToScroll instanceof HTMLElement && typeof this.elementToScroll.getAttribute === 'undefined') {
      const element = document.getElementById(this.elementToScrollId)
      if (element) {
        this.elementToScroll.removeEventListener('scroll', this.onScroll, false)
        element.addEventListener('scroll', this.onScroll, false)
        this.elementToScroll = element
      }
    }
  }

  ngOnDestroy(): void {
    this.elementToScroll?.removeEventListener('scroll', this.onScroll, false)
  }

  onScroll = () => {
    if (!this.loading && this.length > 0 && this.hasMore) {
      if (this.elementToScrollId && this.elementToScroll instanceof HTMLElement) {
        const allScroll = this.elementToScroll?.scrollTop + this.elementToScroll?.scrollHeight
        if (allScroll >= this.elementToScroll?.scrollHeight) {
          this.elementToScroll?.removeEventListener('scroll', this.onScroll, false)
          this.scrolledEmitter.emit()
          this.elementToScroll?.addEventListener('scroll', this.onScroll, false)
        }
      } else if (this.elementToScroll instanceof Window) {
        const elementHeight = this.elementToScroll?.innerHeight
        const elementY = this.elementToScroll?.scrollY
        if (elementHeight + elementY >= this.scrollElement?.nativeElement.offsetHeight + this.scrollElement?.nativeElement.offsetTop) {
          this.elementToScroll?.removeEventListener('scroll', this.onScroll, false)
          this.scrolledEmitter.emit()
          this.elementToScroll?.addEventListener('scroll', this.onScroll, false)
        }
      }
    }
  }
}
