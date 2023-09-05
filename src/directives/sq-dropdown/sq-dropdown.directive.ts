import { Directive, Input, ElementRef, HostListener, Renderer2, OnDestroy, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { sleep } from '../../helpers/sleep.helper'

/**
 * Directive for creating and controlling dropdown menus.
 * 
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/components/dropdown}
 * 
 * @example
 * <div
 *  [dropdown]="true"
 *  dropdownPlacement="left bottom"
 * >
 *   <!-- HTML content, this container may be a button, span, etc -->
 * </div>
 * <ul class="dropdown">
 *   <li>
 *     <!-- Common Item Like <a> or <button> or forms -->
 *   </li>
 *   <li>
 *     <!-- Custom HR -->
 *     <hr class="dropdown-divider" />
 *   </li>
 *   <li>
 *     <div class="dropdown-plain">
 *       <!-- Plain HTML -->
 *     </div>
 *   </li>
 * </ul>
 */
@Directive({
  selector: '[dropdown]',
})
export class SqDropdownDirective implements OnInit, OnDestroy {
  /**
   * Indicates whether the dropdown menu is open or closed.
   */
  @Input('dropdown') content = false

  /**
   * Defines the placement of the dropdown menu in relation to the host element.
   * Possible values: 'left top', 'left bottom', 'center top', 'center bottom', 'right top', 'right bottom'.
   */
  @Input() dropdownPlacement = 'center bottom'

  /**
   * The delay in milliseconds before closing the dropdown after a click outside event.
   */
  @Input() dropdownDelay = 0

  /**
   * Additional CSS class to be applied to the dropdown menu.
   */
  @Input() dropdownClass = ''

  /**
   * The width of the dropdown menu in pixels.
   */
  @Input() dropdownWidth = 'auto'

  /**
   * The vertical distance between the host element and the dropdown menu.
   */
  @Input() dropdownDistanceVertical = 3

  /**
   * The horizontal distance between the host element and the dropdown menu.
   */
  @Input() dropdownDistanceHorizontal = 0

  /**
   * Indicates whether the dropdown should close when a click occurs outside the menu.
   */
  @Input() closeOnClick = false

  /**
   * Reference to the generated dropdown menu element.
   */
  dropdownElement: HTMLElement | null = null

  /*
   * Indicates whether the dropdown menu is open or closed. Used to internal control
   */
  open = false

  /**
   * Constructs a new SqDropdownDirective.
   *
   * @param {ElementRef} el - The ElementRef of the host element.
   * @param {Renderer2} renderer - The Renderer2 for DOM manipulation.
   * @param {Router} router - The Angular Router service.
   */
  constructor(private el: ElementRef, private renderer: Renderer2, private router: Router) {
    this.hide = this.hide.bind(this)
  }

  /**
   * Event listener for the 'click' event on the host element to toggle the dropdown menu.
   */
  @HostListener('click') onClick() {
    if (this.dropdownElement) {
      this.hide()
    }
    if (!this.dropdownElement) {
      this.show()
    }
  }

  /**
   * Initializes the directive, subscribing to router events to automatically close the dropdown on navigation.
   */
  ngOnInit() {
    this.router.events.subscribe((val: any) => {
      if (val instanceof NavigationEnd) {
        this.hide()
      }
    })
  }

  /**
   * Cleans up the directive when it is destroyed, ensuring the dropdown is closed.
   */
  ngOnDestroy() {
    this.hide()
  }

  /**
   * Opens the dropdown menu and sets its position.
   */
  show() {
    this.create()
    document?.addEventListener('click', this.hide, true)
    if (this.dropdownElement) {
      this.renderer.addClass(this.dropdownElement, 'open')
      this.setPosition()
      this.open = true
    }
  }

  /**
   * Closes the dropdown menu with a delay to allow for animations, and performs cleanup.
   */
  hide() {
    if (this.dropdownElement && this.open) {
      window.setTimeout(async () => {
        this.open = false
        this.renderer.removeClass(this.dropdownElement, 'open')
        this.renderer.removeClass(this.dropdownElement, 'dropdown-generated')
        this.renderer.removeClass(this.dropdownElement, `dropdown-${this.dropdownPlacement.replace(' ', '-')}`)
        this.renderer.removeAttribute(this.dropdownElement, 'style')
        this.renderer.insertBefore(this.el.nativeElement.parentNode, this.dropdownElement, this.el.nativeElement.nextSibling)
        await sleep(500)
        this.dropdownElement = null
        document.removeEventListener('click', this.hide, true)
      }, this.dropdownDelay)
    }
  }

  /**
   * Creates the dropdown menu element and appends it to the DOM.
   */
  create() {
    if (this.content) {
      let menu = this.el.nativeElement.nextSibling
      let foundDropdown = false
      while (!foundDropdown) {
        if (!menu || menu?.classList?.contains('dropdown')) {
          foundDropdown = true
          break
        }
        menu = menu.nextSibling
      }
      if (!menu?.classList || !menu.classList?.contains('dropdown')) {
        return
      }
      this.dropdownElement = menu
      menu.getAttribute('dropdown')
      this.renderer.addClass(this.dropdownElement, 'dropdown-generated')
      this.renderer.addClass(this.dropdownElement, `dropdown-${this.dropdownPlacement.replace(' ', '-')}`)
      this.renderer.setAttribute(this.dropdownElement, 'style', `width: ${this.dropdownWidth}`)
      this.renderer.appendChild(document.body, this.dropdownElement)
    }
  }

  /**
   * Sets the position of the dropdown menu relative to the host element.
   */
  setPosition() {
    const hostPos = this.el.nativeElement.getBoundingClientRect()
    if (this.dropdownElement) {
      const dropdownPos = this.dropdownElement.getBoundingClientRect()
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      let top
      let left

      const posHorizontal = this.dropdownPlacement.split(' ')[0] || 'center'
      const posVertical = this.dropdownPlacement.split(' ')[1] || 'bottom'
      console.log('positions', hostPos.left, hostPos.width, dropdownPos.width)
      console.log('string', posHorizontal, posVertical)
      switch (posHorizontal) {
        case 'left':
          left = hostPos.left + hostPos.width - dropdownPos.width + this.dropdownDistanceHorizontal
          break

        case 'right':
          left = hostPos.left + this.dropdownDistanceHorizontal
          break

        default:
        case 'center':
          left = hostPos.left - dropdownPos.width / 2 + hostPos.width / 2 + this.dropdownDistanceHorizontal
          break
      }

      switch (posVertical) {

        default:
        case 'bottom':
          top = hostPos.bottom + this.dropdownDistanceVertical
          break

        case 'top':
          top = hostPos.top - dropdownPos.height - this.dropdownDistanceVertical
      }

      this.renderer.setStyle(this.dropdownElement, 'top', `${top + scrollPos}px`)
      this.renderer.setStyle(this.dropdownElement, 'left', `${left}px`)
    }
  }
}

