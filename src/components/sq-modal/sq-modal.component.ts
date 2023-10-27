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
 * Represents a modal component with customizable options and event handling.
 * 
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/components/modal}
 * 
 * @example
 * <sq-modal [open]="isModalOpen" (modalClose)="onModalClose()">
 *   <ng-template #headerModal>
 *     <h2>Title</h2>
 *   </ng-template>
 *   <div>
 *     <!-- Your content here -->
 *   </div>
*    <ng-template #footerModal>
 *     Footer
 *   </ng-template>
 * </sq-modal>
 * <button (click)='isModalOpen = true'>Open Modal</button>
 *
 * @implements {OnChanges}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'sq-modal',
  templateUrl: './sq-modal.component.html',
  styleUrls: ['./sq-modal.component.scss'],
})
export class SqModalComponent implements OnChanges, OnDestroy {
  /**
   * A unique identifier for the modal component.
   */
  @Input() id = `modal-random-id-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`

  /**
   * Indicates whether the modal should be open or closed.
   */
  @Input() open?: boolean

  /**
   * The size of the modal, which can be 'sm' (small), 'md' (medium), 'lg' (large), or 'xl' (extra large).
   */
  @Input() modalSize: 'sm' | 'md' | 'lg' | 'xl' | '' = 'md'

  /**
   * Additional CSS classes to apply to the modal element.
   */
  @Input() modalClass?: string

  /**
   * Additional CSS classes to apply to the modal backdrop element.
   */
  @Input() backdropClass?: string

  /**
   * Determines whether clicking outside the modal closes it. Options: 'static' (no close), 'true' (close).
   */
  @Input() backdrop = 'static'

  /**
   * Event emitted when the modal is closed.
   */
  @Output() modalClose: EventEmitter<void> = new EventEmitter()

  /**
   * Event emitted when the left arrow key is pressed while the modal is open.
   */
  @Output() leftPress: EventEmitter<void> = new EventEmitter()

  /**
   * Event emitted when the right arrow key is pressed while the modal is open.
   */
  @Output() rightPress: EventEmitter<void> = new EventEmitter()

  /**
   * Reference to the modal element in the component's template.
   */
  @ViewChild('modal') modal: ElementRef | null = null

  /**
   * Reference to the header template provided in the component's content.
   */
  @ContentChild('headerModal') headerTemplate?: TemplateRef<ElementRef> | null = null

  /**
   * Reference to the footer template provided in the component's content.
   */
  @ContentChild('footerModal') footerTemplate?: TemplateRef<ElementRef> | null = null

  /**
   * HTML collection of modal elements in the document.
   */
  modals: HTMLCollectionOf<Element> | undefined

  /**
   * The number of open modals in the document.
   */
  modalNumber = 0

  /**
   * Indicates whether the modal has a header template.
   */
  hasHeader = false

  /**
   * Reference to the Document object for interacting with the DOM.
   */
  document: Document

  /**
   * Indicates the origin path from modal.
   *
   */
  localized: string

  /**
   * A subscription to the router change url.
   */
  routerObservable!: Subscription

  /**
   * Creates an instance of `SqModalComponent`.
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
    if (changes.hasOwnProperty('open')) {
      const modal = this.modal
      if (modal) {
        const body = this.document.getElementsByTagName('body')[0]
        body.appendChild(modal.nativeElement)
        const backdrop = this.document.getElementById('modal-backdrop') || this.document.createElement('div')
        if (this.open) {
          this.observeRouter()
          this.hasHeader = !!this.headerTemplate
          body.classList.add('block')
          modal.nativeElement.style.display = 'flex'
          window.addEventListener('keydown', this.onKeydown)
          this.modals = this.document.getElementsByClassName('modal open')
          await sleep(10)
          this.modalNumber = this.modals?.length || 0
          if (this.modalNumber <= 1) {
            backdrop.setAttribute('id', 'modal-backdrop')
            backdrop.setAttribute('class', 'modal-backdrop show')
            body.appendChild(backdrop)
          } else if (this.modalNumber > 1) {
            modal.nativeElement.style.zIndex = 1060 + this.modalNumber + 1
            backdrop.setAttribute('style', `z-index: ${1060 + this.modalNumber};`)
          }
        } else {
          this.removeModalFromBody()
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
        this.removeModalFromBody()
        await sleep(1000)
      }
    })
  }

  /**
   * Removes the modal element from document body.
   */
  removeModalFromBody() {
    const body = this.document.getElementsByTagName('body')[0]
    const backdrop = this.document.getElementById('modal-backdrop')
    const modal = this.document.getElementById(this.id)
    this.modalClose.emit()
    backdrop?.removeAttribute('style')
    modal?.parentNode?.removeChild(modal)
    if (this.modalNumber <= 1) {
      backdrop?.parentNode?.removeChild(backdrop)
      body?.classList?.remove('block')
    }
  }

  /**
   * Handles keyboard events for the modal component.
   *
   * @param event - The keyboard event object.
   */
  onKeydown(event: KeyboardEvent) {
    if (this.open) {
      this.modals = this.document.getElementsByClassName('modal')
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
        this.modalClose.emit()
        break
      case 'ArrowLeft':
        this.leftPress.emit()
        break
      case 'ArrowRight':
        this.rightPress.emit()
        break
    }
  }
}
