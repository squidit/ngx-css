import { Directive, Input, ElementRef, HostListener, Renderer2, OnDestroy, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'

@Directive({
  selector: '[dropdown]',
})
export class SqDropdownDirective implements OnInit, OnDestroy {
  @Input('dropdown') content = false
  @Input() dropdownPlacement = 'center bottom'
  @Input() dropdownDelay = 0
  @Input() dropdownClass = ''
  @Input() dropdownWidth = 0
  @Input() dropdownDistanceVertical = 3
  @Input() dropdownDistanceHorizontal = 0
  @Input() closeOnClick = false
  dropdownElement: HTMLElement | null = null

  constructor(private el: ElementRef, private renderer: Renderer2, private router: Router) { }

  @HostListener('click') onClick() {
    if (this.dropdownElement) {
      this.hide()
    }
    if (!this.dropdownElement) {
      this.show()
    }
  }

  @HostListener('document:click', ['$event']) clickOutsideMenu(event: { target: any }) {
    if (
      this.dropdownElement &&
      ((this.dropdownElement?.contains(event.target) && this.closeOnClick) ||
        (!this.dropdownElement?.contains(event.target) && !this.el.nativeElement.contains(event.target)))
    ) {
      this.hide()
    }
  }

  ngOnInit() {
    this.router.events.subscribe((val: any) => {
      if (val instanceof NavigationEnd) {
        this.hide()
      }
    })
  }

  ngOnDestroy() {
    this.hide()
  }

  show() {
    this.create()
    if (this.dropdownElement) {
      this.renderer.addClass(this.dropdownElement, 'open')
      this.setPosition()
    }
  }

  hide() {
    if (this.dropdownElement) {
      window.setTimeout(() => {
        this.renderer.removeClass(this.dropdownElement, 'open')
        this.renderer.removeClass(this.dropdownElement, 'dropdown-generated')
        this.renderer.removeClass(this.dropdownElement, `dropdown-${this.dropdownPlacement.replace(' ', '-')}`)
        this.renderer.removeAttribute(this.dropdownElement, 'style')
        this.renderer.insertBefore(this.el.nativeElement.parentNode, this.dropdownElement, this.el.nativeElement.nextSibling)
        this.dropdownElement = null
      }, this.dropdownDelay)
    }
  }

  create() {
    if (this.content) {
      let menu = this.el.nativeElement.nextSibling
      let foundDropdown = false
      while (!foundDropdown) {
        if (!menu || (menu.classList && menu.classList.contains('dropdown'))) {
          foundDropdown = true
          break
        }
        menu = menu.nextSibling
      }
      if (!menu || !menu.classList || (menu.classList && !menu.classList.contains('dropdown'))) {
        return
      }
      this.dropdownElement = menu
      menu.getAttribute('dropdown')
      this.renderer.addClass(this.dropdownElement, 'dropdown-generated')
      this.renderer.addClass(this.dropdownElement, `dropdown-${this.dropdownPlacement.replace(' ', '-')}`)
      this.renderer.setAttribute(this.dropdownElement, 'style', `width: ${this.dropdownWidth}px`)
      this.renderer.appendChild(document.body, this.dropdownElement)
    }
  }

  setPosition() {
    const hostPos = this.el.nativeElement.getBoundingClientRect()
    if (this.dropdownElement) {
      const dropdownPos = this.dropdownElement.getBoundingClientRect()
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      let top
      let left

      const posHorizontal = this.dropdownPlacement.split(' ')[0] || 'right'
      const posVertical = this.dropdownPlacement.split(' ')[1] || 'bottom'

      switch (posHorizontal) {
        case 'left':
          left = hostPos.left + hostPos.width - dropdownPos.width + this.dropdownDistanceHorizontal
          break

        case 'right':
          left = hostPos.left + this.dropdownDistanceHorizontal
          break

        // eslint-disable-next-line
        default:
        case 'center':
          left = hostPos.left - dropdownPos.width / 2 + hostPos.width / 2 + this.dropdownDistanceHorizontal
          break
      }

      switch (posVertical) {
        case 'bottom':
          top = hostPos.bottom + this.dropdownDistanceVertical
          break
        // eslint-disable-next-line
        default:
        case 'top':
          top = hostPos.top - dropdownPos.height - this.dropdownDistanceVertical
      }

      this.renderer.setStyle(this.dropdownElement, 'top', `${top + scrollPos}px`)
      this.renderer.setStyle(this.dropdownElement, 'left', `${left}px`)
    }
  }
}
