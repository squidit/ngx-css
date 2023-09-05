import { Directive, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { sleep } from '../../helpers/sleep.helper'
import { DOCUMENT } from '@angular/common'

/**
 * Angular directive for creating and managing tooltips.
 *
 * This directive allows you to easily add tooltips to elements in your Angular application.
 * Tooltips can display additional information when hovering or clicking on an element.
 *
 * @see {@link https://css.squidit.com.br/components/tooltip|Official Tooltip Documentation}
 *
 * @example
 * <!-- Basic usage -->
 * <div [tooltip]="'Tooltip message'" placement="center top"></div>
 */
@Directive({
  selector: '[tooltip]',
})
export class SqTooltipDirective implements OnInit, OnDestroy {
  /**
   * The content of the tooltip. Can be a string message or an Angular TemplateRef.
   */
  @Input('tooltip') content?: string | null | TemplateRef<any> = ''

  /**
   * The placement of the tooltip relative to the host element.
   * Possible values: 'left top', 'left center', 'left bottom', 'center top',
   * 'center center', 'center bottom', 'right top', 'right center', 'right bottom'.
   */
  @Input() placement = 'center top'

  /**
   * The delay in milliseconds before showing the tooltip.
   */
  @Input() delay = 0

  /**
   * The theme of the tooltip. Possible values: 'light' or 'dark'.
   */
  @Input() theme: 'light' | 'dark' = 'dark'

  /**
   * The trigger for displaying the tooltip. Possible values: 'hover' or 'click'.
   */
  @Input() trigger: 'hover' | 'click' = 'hover'

  /**
   * Reference to the generated tooltip element.
   */
  tooltipElement: HTMLElement | null = null

  /**
   * The offset between the tooltip and the host element.
   */
  offset = 10

  /**
   * Reference to the window object.
   */
  window = window

  /**
   * Indicates whether the tooltip is open or closed. Used for internal control.
   */
  open = false

  /**
   * Reference to the Document object for interacting with the DOM.
   */
  document: Document

  /**
   * Constructs a new SqTooltipDirective.
   *
   * @param {ElementRef} el - The ElementRef of the host element.
   * @param {Renderer2} renderer - The Renderer2 for DOM manipulation.
   * @param {Router} router - The Angular Router service.
   * @param {ViewContainerRef} viewContainerRef - The ViewContainerRef for the tooltip.
   * @param {Document} documentImported - The injected Document object for DOM manipulation.
   */
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) private documentImported: Document
  ) {
    // Bind the hide function to the current instance.
    this.hide = this.hide.bind(this)
    // Assign the document object for DOM manipulation.
    this.document = this.documentImported || document
  }

  /**
   * Event listener for the 'mouseenter' event to show the tooltip on hover.
   */
  @HostListener('mouseenter') onMouseEnter() {
    if (!this.isTouch()) {
      if (!this.tooltipElement && this.trigger === 'hover') {
        this.show()
      }
    }
  }

  /**
   * Event listener for the 'mouseleave' event to hide the tooltip on hover.
   */
  @HostListener('mouseleave') onMouseLeave() {
    if (!this.isTouch()) {
      if (this.tooltipElement && this.trigger === 'hover') {
        this.hide()
      }
    }
  }

  /**
   * Event listener for the 'click' event to toggle the tooltip on click.
   */
  @HostListener('click') onClick() {
    if (this.tooltipElement && (this.trigger === 'click' || this.isTouch())) {
      this.hide()
    }
    if (!this.tooltipElement && (this.trigger === 'click' || this.isTouch())) {
      this.show()
    }
  }

  /**
   * Initializes the directive and subscribes to router events to hide the tooltip on navigation.
   */
  ngOnInit() {
    this.router.events.subscribe((val: unknown) => {
      if (val instanceof NavigationEnd) {
        this.hide()
      }
    })
  }

  /**
   * Cleans up the directive when it is destroyed, ensuring the tooltip is hidden.
   */
  ngOnDestroy() {
    this.hide()
  }

  /**
   * Checks if the device has touch support.
   *
   * @returns {boolean} - True if the device supports touch events; otherwise, false.
   */
  isTouch(): boolean {
    return 'ontouchstart' in window || navigator?.maxTouchPoints > 0
  }

  /**
   * Shows the tooltip and sets its position.
   */
  async show() {
    this.create()
    this.setPosition()
    this.document?.addEventListener('click', this.hide, true)
    if (this.tooltipElement) {
      this.renderer.addClass(this.tooltipElement, 'tooltip-show')
      await sleep(500) // Wait for animations.
      this.open = true
    }
  }

  /**
   * Hides the tooltip with a delay to allow for animations, and performs cleanup.
   */
  hide() {
    if (this.tooltipElement && this.open) {
      this.renderer.removeClass(this.tooltipElement, 'tooltip-show')
      window.setTimeout(() => {
        if (this.tooltipElement) {
          this.renderer.removeChild(this.document.body, this.tooltipElement)
        }
        this.tooltipElement = null
        this.open = false
      }, this.delay)
      this.document.removeEventListener('click', this.hide, true)
    }
  }

  /**
   * Creates the tooltip element and appends it to the DOM.
   */
  create() {
    if (this.content) {
      const arrow: HTMLElement = this.renderer.createElement('div')
      this.renderer.addClass(arrow, 'tooltip-arrow')
      if (this.isTouch()) {
        this.renderer.addClass(arrow, 'tooltip-not-arrow')
      }
      this.tooltipElement = this.renderer.createElement('div')
      if (this.tooltipElement) {
        if (this.content instanceof TemplateRef) {
          for (const node of this.viewContainerRef.createEmbeddedView(this.content).rootNodes) {
            this.renderer.appendChild(this.tooltipElement, node)
          }
        }
        if (typeof this.content === 'string') {
          this.tooltipElement.innerHTML = this.content
        }
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
      this.renderer.appendChild(this.document.body, this.tooltipElement)
    }
  }

  /**
   * Sets the position of the tooltip relative to the host element.
   */
  setPosition() {
    const hostPos = this.el.nativeElement.getBoundingClientRect()

    if (this.tooltipElement) {
      const tooltipPos = this.tooltipElement.getBoundingClientRect()
      const scrollPos = window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0
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
