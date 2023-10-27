import { DOCUMENT } from '@angular/common'
import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core'
import { sleep } from '../../helpers/sleep.helper'
import { NavigationStart, Router } from '@angular/router'
import { Subscription } from 'rxjs'

/**
 * Represents an overlay component, an abstraction with differente style but still a modal.
 *
 * @example
 * <sq-overlay [open]="isOverlayOpen" overlayDirection="right" (overlayClose)="onOverlayClose()">
 *   <ng-template #headerTemplate>
 *     <h2>Overlay Header</h2>
 *   </ng-template>
 *   <ng-template #footerTemplate>
 *     Footer
 *   </ng-template>
 *   <div>
 *     <!-- Your content here -->
 *   </div>
 * </sq-overlay>
 * <button (click)='isOverlayOpen = true'>Open Modal</button>
 * 
 * @implements {OnChanges}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'sq-overlay',
  templateUrl: './sq-overlay.component.html',
  styleUrls: ['./sq-overlay.component.scss'],
})
export class SqOverlayComponent implements OnChanges, OnDestroy {
  /**
   * A unique identifier for the overlay.
   */
  @Input() id = `overlay-random-id-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`

  /**
   * Indicates whether the overlay is open or closed.
   *
   */
  @Input() open?: boolean

  /**
   * The direction in which the overlay slides in when opened.
   *
   */
  @Input() overlayDirection: 'right' | 'left' = 'right'

  /**
   * The width of the overlay.
   *
   */
  @Input() width = '475px'

  /**
   * Determines whether the overlay has a border.
   *
   */
  @Input() borderless = false

  /**
   * The background color of the overlay header.
   *
   */
  @Input() headerColor = 'var(--background_secondary)'

  /**
   * The text color of items within the overlay header.
   *
   */
  @Input() headerItemsColor = ''

  /**
   * The background color of the overlay footer.
   *
   */
  @Input() footerColor = 'var(--background_secondary)'

  /**
   * The background color of the overlay body.
   *
  */
  @Input() bodyColor = 'var(--background_secondary)'

  /**
   * Determines whether the close button is shown.
   *
   */
  @Input() showClose = true

  /**
   * Specifies the behavior of the backdrop when clicked.
   *
   */
  @Input() backdrop = 'static'

  /**
   * Emits an event when the overlay is closed.
   *
   */
  @Output() overlayClose: EventEmitter<void> = new EventEmitter()

  /**
   * Emits an event when the left arrow key is pressed.
   *
   */
  @Output() leftPress: EventEmitter<void> = new EventEmitter()

  /**
   * Emits an event when the right arrow key is pressed.
   *
   */
  @Output() rightPress: EventEmitter<void> = new EventEmitter()

  /**
   * A reference to the overlay element.
   *
   */
  @ViewChild('overlay') overlay: ElementRef | null = null

  /**
   * A reference to the header template.
   *
   */
  @ContentChild('headerTemplate') headerTemplate?: TemplateRef<ElementRef> | null = null

  /**
   * A reference to the footer template.
   *
   */
  @ContentChild('footerTemplate') footerTemplate?: TemplateRef<ElementRef> | null = null

  /**
   * A collection of modal elements.
   *
   */
  modals: HTMLCollectionOf<Element> | undefined

  /**
   * The number of modal elements.
   *
   */
  modalNumber = 0

  /**
   * Indicates whether the overlay has a header.
   *
   */
  hasHeader = false

  /**
   * Indicates whether the overlay has a footer.
   *
   */
  hasFooter = false

  /**
   * A reference to the Document object.
   *
   */
  document: Document

  /**
   * A unique style identifier.
   *
   */
  styleId = `overlay-style-random-id-${new Date().getTime()}-${Math.random().toString(36).substring(7)}`

  /**
   * Indicates whether the overlay has finished opening.
   *
   */
  finishOpening = false

  /**
   * Indicates the origin path from overlay.
   *
   */
  localized: string

  /**
   * A subscription to the router change url.
   */
  routerObservable!: Subscription

  /**
   * Constructs an instance of SqOverlayComponent.
   *
   * @param {Document} documentImported - The injected Document object for DOM manipulation.
   * @param {Router} router - The Router service for programmatic navigation.
   */
  constructor(@Inject(DOCUMENT) public documentImported: Document, public router: Router) {
    this.onKeydown = this.onKeydown.bind(this)
    this.document = documentImported || document
    this.localized = this.router.url
  }

  /**
   * Lifecycle hook that detects changes to the 'open' input property and handles modal behavior accordingly.
   *
   * @param changes - The changes detected in the component's input properties.
   */
  async ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('width') && this.open) {
      this.doCssWidth()
    }
    if (changes.hasOwnProperty('open')) {
      const overlay = this.overlay
      if (overlay) {
        const body = this.document.getElementsByTagName('body')[0]
        body.appendChild(overlay.nativeElement)
        const backdrop = this.document.getElementById('modal-backdrop') || this.document.createElement('div')
        if (this.open) {
          this.observeRouter()
          this.doCssWidth()
          this.hasFooter = !!this.footerTemplate
          this.hasHeader = !!this.headerTemplate
          body.classList.add('block')
          overlay.nativeElement.style.display = 'flex'
          window.addEventListener('keydown', this.onKeydown)
          this.modals = this.document.getElementsByClassName('modal open')
          await sleep(10)
          this.modalNumber = this.modals?.length || 0
          if (this.modalNumber <= 1) {
            backdrop.setAttribute('id', 'modal-backdrop')
            backdrop.setAttribute('class', 'modal-backdrop show')
            body.appendChild(backdrop)
          } else if (this.modalNumber > 1) {
            overlay.nativeElement.style.zIndex = 1060 + this.modalNumber + 1
            backdrop.setAttribute('style', `z-index: ${1060 + this.modalNumber};`)
          }
          this.finishOpening = true
        } else {
          this.removeOverlayFromBody()
          window.removeEventListener('keydown', this.onKeydown)
        }
      }
    }
  }

  /**
   * Performs actions before the component is destroyed.
   */
  ngOnDestroy(): void {
    this.routerObservable?.unsubscribe()
  }

  /**
   * Function that init the routerObservable.
   */
  observeRouter() {
    this.routerObservable = this.router.events.subscribe(async (event) => {
      if (this.localized !== undefined && event instanceof NavigationStart && this.localized?.split('?')?.[0] !== event.url?.split('?')?.[0]) {
        this.removeOverlayFromBody()
        await sleep(1000)
      }
    })
  }

  /**
   * Removes the overlay element from document body.
   */
  removeOverlayFromBody() {
    const body = this.document.getElementsByTagName('body')[0]
    const backdrop = this.document.getElementById('modal-backdrop')
    const overlay: any = this.document.getElementById(this.id)
    this.overlayClose.emit()
    this.finishOpening = false
    this.undoCssWidth()
    backdrop?.removeAttribute('style')
    overlay?.parentNode?.removeChild(overlay)
    if (this.modalNumber <= 1) {
      backdrop?.parentNode?.removeChild(backdrop)
      body?.classList?.remove('block')
    }
  }

  /**
   * Applies CSS styles to set the width of the overlay.
   */
  doCssWidth() {
    const css = `
      .overlay.open .modal-dialog.opened {
        width: ${this.width};
      }
    `
    const head = this.document.getElementsByTagName('head')[0]
    let style = this.document.getElementById(this.styleId)
    if (!style) {
      style = this.document.createElement('style')
      style.setAttribute('id', this.styleId)
      style.appendChild(this.document.createTextNode(css))
      head.appendChild(style)
    } else {
      style.innerHTML = ''
      style.appendChild(this.document.createTextNode(css))
    }
  }

  /**
   * Removes the CSS styles that set the width of the overlay.
   */
  undoCssWidth() {
    const style = this.document.getElementById(this.styleId)
    if (style?.parentNode) {
      style.parentNode.removeChild(style)
    }
  }

  /**
   * Handles keyboard events for the modal component.
   *
   * @param event - The keyboard event object.
   */
  onKeydown(event: KeyboardEvent) {
    if (this.open) {
      this.modals = this.document.getElementsByClassName('modal open')
      if (this.modals?.length === this.modalNumber) {
        this.events(event.key)
      }
    }
  }

  /**
   * Handles specific keyboard events.
   *
   * @param key - The key code of the pressed key.
   */
  events(key: string) {
    switch (key) {
      case 'Escape':
        this.overlayClose.emit()
        break
      case 'ArrowLeft':
        this.leftPress.emit()
        break
      case 'ArrowRight':
        this.rightPress.emit()
        break
    }
  }

  /**
   * Closes the overlay logic.
   */
  toCloseOverlay() {
    if (this.overlay && this.open) {
      const body = this.document.getElementsByTagName('body')[0]
      const backdrop = this.document.getElementById('modal-backdrop') || this.document.createElement('div')
      this.overlayClose.emit()
      this.overlay.nativeElement.style.display = 'none'
      if (backdrop.parentNode && this.modalNumber <= 1) {
        backdrop.parentNode.removeChild(backdrop)
        body.classList.remove('block')
      }
      window.removeEventListener('keydown', this.onKeydown)
    }
  }
}
