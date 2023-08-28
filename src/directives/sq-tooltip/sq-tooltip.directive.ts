import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'

@Directive({
  selector: '[tooltip]',
})
export class SqTooltipDirective implements OnInit, OnDestroy {
  @Input('tooltip') content = ''
  @Input() placement = 'center top'
  @Input() delay = 0
  @Input() theme: 'light' | 'dark' = 'dark'
  @Input() trigger: 'hover' | 'click' = 'hover'
  tooltipElement: HTMLElement | null = null
  offset = 10
  window = window

  constructor(private el: ElementRef, private renderer: Renderer2, private router: Router) { }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.isTouch()) {
      if (!this.tooltipElement && this.trigger === 'hover') {
        this.show()
      }
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (!this.isTouch()) {
      if (this.tooltipElement && this.trigger === 'hover') {
        this.hide()
      }
    }
  }

  @HostListener('click') onClick() {
    if (this.tooltipElement && (this.trigger === 'click' || this.isTouch())) {
      this.hide()
    }
    if (!this.tooltipElement && (this.trigger === 'click' || this.isTouch())) {
      this.show()
    }
  }

  @HostListener('document:click', ['$event']) onClickDocument(event: MouseEvent) {
    if (this.isTouch() && this.trigger === 'hover' && !event?.composedPath()?.includes(this.el.nativeElement)) {
      this.hide()
    }
  }

  ngOnInit() {
    this.router.events.subscribe((val: unknown) => {
      if (val instanceof NavigationEnd) {
        this.hide()
      }
    })
  }

  ngOnDestroy() {
    this.hide()
  }

  isTouch() {
    return 'ontouchstart' in window || navigator?.maxTouchPoints > 0
  }

  show() {
    this.create()
    this.setPosition()
    if (this.tooltipElement) {
      this.renderer.addClass(this.tooltipElement, 'tooltip-show')
    }
  }

  hide() {
    if (this.tooltipElement) {
      this.renderer.removeClass(this.tooltipElement, 'tooltip-show')
      window.setTimeout(() => {
        if (this.tooltipElement) {
          this.renderer.removeChild(document.body, this.tooltipElement)
        }
        this.tooltipElement = null
      }, this.delay)
    }
  }

  create() {
    if (this.content) {
      const arrow: HTMLElement = this.renderer.createElement('div')
      this.renderer.addClass(arrow, 'tooltip-arrow')
      if (this.isTouch()) {
        this.renderer.addClass(arrow, 'tooltip-not-arrow')
      }
      this.tooltipElement = this.renderer.createElement('div')

      if (this.tooltipElement) {
        this.tooltipElement.innerHTML = this.content
      }

      this.renderer.addClass(this.tooltipElement, 'tooltip')
      this.renderer.addClass(this.tooltipElement, 'tooltip-generated')
      this.renderer.addClass(this.tooltipElement, `tooltip-${this.theme}`)
      this.renderer.addClass(this.tooltipElement, `tooltip-${this.placement.replace(' ', '-')}`)
      this.renderer.addClass(this.tooltipElement, 'text-left')
      this.renderer.setStyle(this.tooltipElement, '-webkit-transition', `opacity ${this.delay}ms`)
      this.renderer.setStyle(this.tooltipElement, '-moz-transition', `opacity ${this.delay}ms`)
      this.renderer.setStyle(this.tooltipElement, '-o-transition', `opacity ${this.delay}ms`)
      this.renderer.setStyle(this.tooltipElement, 'transition', `opacity ${this.delay}ms`)

      this.renderer.appendChild(this.tooltipElement, arrow)

      // this.renderer.appendChild(this.tooltipElement, this.renderer.createText(this.content))

      this.renderer.appendChild(document.body, this.tooltipElement)
    }
  }

  setPosition() {
    const hostPos = this.el.nativeElement.getBoundingClientRect()

    if (this.tooltipElement) {
      const tooltipPos = this.tooltipElement.getBoundingClientRect()

      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0

      let top
      let left

      const posHorizontal = this.placement.split(' ')[0] || 'center'
      const posVertical = this.placement.split(' ')[1] || 'bottom'

      switch (posHorizontal) {
        case 'left':
          left = hostPos.left - tooltipPos.width - this.offset
          break

        case 'right':
          left = hostPos.right + this.offset
          break
        default:
        case 'center':
          left = hostPos.left + (hostPos.width - tooltipPos.width) / 2
      }

      switch (posVertical) {
        case 'center':
          top = hostPos.top + (hostPos.height - tooltipPos.height) / 2
          break

        case 'bottom':
          top = hostPos.bottom + this.offset
          break
        default:
        case 'top':
          top = hostPos.top - tooltipPos.height - this.offset
      }

      this.renderer.setStyle(this.tooltipElement, 'top', `${top + scrollPos}px`)
      this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`)
    }
  }
}
