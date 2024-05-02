import { Directive, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { sleep } from '../../helpers/sleep.helper'
import { DOCUMENT } from '@angular/common'
import { GetWindow } from 'src/helpers/window.helper'

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
  window = this.getWindow.window()

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
   * @constructor
   * @param {ElementRef} el - The ElementRef of the host element.
   * @param {Renderer2} renderer - The Renderer2 for DOM manipulation.
   * @param {Router} router - The Angular Router service.
   * @param {ViewContainerRef} viewContainerRef - The ViewContainerRef for the tooltip.
   * @param {Document} documentImported - The injected Document object for DOM manipulation.
   * @param {GetWindow} getWindow - The GetWindow service for accessing the window object.
   */
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) private documentImported: Document,
    public getWindow: GetWindow
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
    if (!this.isTouch() && !this.tooltipElement && this.trigger === 'hover') {
      this.show()
    }
  }

  /**
   * Event listener for the 'mouseleave' event to hide the tooltip on hover.
   */
  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltipElement && this.trigger === 'hover' && !this.isTouch()) {
      this.hide()
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
    const window = this.getWindow.window()
    if (window) {
      return 'ontouchstart' in window || window.navigator.maxTouchPoints > 0
    }
    return false
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
    if (
      this.tooltipElement &&
      ((this.isTouch() || this.trigger === 'click') && this.open) ||
      (!this.isTouch() && this.trigger === 'hover')
    ) {
      try {
        this.renderer.removeClass(this.tooltipElement, 'tooltip-show')
      } catch (e) {
        // Ignore error
      }
      this.getWindow?.window()?.setTimeout(() => {
        try {
          this.renderer.removeChild(this.document.body, this.tooltipElement)
        }
        catch (e) {
          // Ignore error
        }
        this.open = false
        this.document.removeEventListener('click', this.hide, true)
        this.tooltipElement = null
      }, this.delay)
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
    if (this.tooltipElement) {
      const parentCoords = this.el.nativeElement.getBoundingClientRect()
      const tooltipCoords = this.tooltipElement.getBoundingClientRect()

      const posHorizontal = this.placement.split(' ')[0] || 'center'
      const posVertical = this.placement.split(' ')[1] || 'bottom'

      const distance = 7

      let top
      let left

      switch (posHorizontal) {
        case 'left':
          left = parseInt(parentCoords.left) - distance - tooltipCoords.width
          if (parseInt(parentCoords.left) - tooltipCoords.width < 0) {
            left = distance
          }
          break

        case 'right':
          left = parentCoords.right + distance
          if (parseInt(parentCoords.right) + tooltipCoords.width > document.documentElement.clientWidth) {
            left = document.documentElement.clientWidth - tooltipCoords.width - distance
          }
          break

        default:
        case 'center':
          left = (parseInt(parentCoords.left) - (tooltipCoords.width / 2)) + (parentCoords.width / 2)
      }

      switch (posVertical) {
        case 'center':
          top = (parseInt(parentCoords.top) + parseInt(parentCoords.bottom)) / 2 - this.tooltipElement.offsetHeight / 2
          break

        case 'bottom':
          top = parseInt(parentCoords.bottom) + distance
          break

        default:
        case 'top':
          top = parseInt(parentCoords.top) - this.tooltipElement.offsetHeight - distance
      }

      this.renderer.setStyle(this.tooltipElement, 'left', `${left < 0 ? parseInt(parentCoords.left) : left}px`)
      const scrollY = this.getWindow?.window()?.scrollY ?? 0
      this.renderer.setStyle(this.tooltipElement, 'top', `${(top < 0 ? parseInt(parentCoords.bottom) + distance : top) + scrollY}px`)
    }
  }
}
