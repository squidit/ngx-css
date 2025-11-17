import { SqDataTestDirective } from './../../directives/sq-data-test/sq-data-test.directive';
import { DOCUMENT, NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
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
} from '@angular/core';
import { sleep } from '../../helpers/sleep.helper';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetWindow } from '../../helpers/window.helper';
import { SqClickOutsideDirective } from '../../directives/sq-click-outside/sq-click-outside.directive';

/**
 * Represents a modal component with customizable options and event handling.
 *
 * @deprecated Este componente está obsoleto. Use o serviço `SqModalManagerService` para criar modais dinâmicos.
 *
 * @see {@link SqModalManagerService} - Serviço recomendado para criação de modais
 * @see {@link https://css.squidit.com.br/components/modal} - Documentação do framework original
 *
 * @example
 * // ❌ Forma antiga (deprecated):
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
 * // ✅ Forma nova (recomendada):
 * constructor(private modalManager: SqModalManagerService) {}
 *
 * openModal() {
 *   this.modalManager.open(MyContentComponent, {
 *     type: 'modal',
 *     size: 'lg',
 *     title: 'Título do Modal'
 *   });
 * }
 *
 * @implements {OnChanges}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'sq-modal',
  templateUrl: './sq-modal.component.html',
  styleUrls: ['./sq-modal.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet, SqClickOutsideDirective, SqDataTestDirective],
})
export class SqModalComponent implements OnChanges, OnDestroy {
  /**
   * A unique identifier for the modal component.
   */
  @Input() id = `modal-random-id-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`;

  /**
   * Indicates whether the modal should be open or closed.
   */
  @Input() open?: boolean;

  /**
   * The size of the modal, which can be 'sm' (small), 'md' (medium), 'lg' (large), or 'xl' (extra large).
   */
  @Input() modalSize: 'sm' | 'md' | 'lg' | 'xl' | '' = 'md';

  /**
   * Additional CSS classes to apply to the modal element.
   */
  @Input() modalClass?: string;

  /**
   * Additional CSS classes to apply to the modal backdrop element.
   */
  @Input() backdropClass?: string;

  /**
   * Determines whether clicking outside the modal closes it. Options: 'static' (no close), 'true' (close).
   */
  @Input() backdrop = 'static';

  /**
   * Determines whether to display the close button.
   */
  @Input() buttonClose = true;

  /**
   * Determines the header padding.
   */
  @Input() headerPadding = '';

  /**
   * Determines the body padding.
   */
  @Input() bodyPadding = '0 1rem';

  /**
   * Determines the footer padding.
   */
  @Input() footerPadding = '';

  /**
   * Determines the header background color.
   */
  @Input() headerBackgroundColor = '';

  /**
   * Determines the body background color.
   */
  @Input() bodyBackgroundColor = '';

  /**
   * Determines the footer background color.
   */
  @Input() footerBackgroundColor = '';

  /**
   * The data-test attribute value for the modal element.
   *
   * @default 'sq-modal-element'
   */
  @Input() modalDataTest = 'sq-modal-element';
  /**
   * Event emitted when the modal is closed.
   */
  @Output() modalClose: EventEmitter<void> = new EventEmitter();

  /**
   * Event emitted when the left arrow key is pressed while the modal is open.
   */
  @Output() leftPress: EventEmitter<void> = new EventEmitter();

  /**
   * Event emitted when the right arrow key is pressed while the modal is open.
   */
  @Output() rightPress: EventEmitter<void> = new EventEmitter();

  /**
   * Reference to the modal element in the component's template.
   */
  @ViewChild('modal') modal: ElementRef | null = null;

  /**
   * Reference to the header template provided in the component's content.
   */
  @ContentChild('headerModal') headerTemplate?: TemplateRef<ElementRef> | null = null;

  /**
   * Reference to the footer template provided in the component's content.
   */
  @ContentChild('footerModal') footerTemplate?: TemplateRef<ElementRef> | null = null;

  /**
   * HTML collection of modal elements in the document.
   */
  modals: HTMLCollectionOf<Element> | undefined;

  /**
   * The number of open modals in the document.
   */
  modalNumber = 0;

  /**
   * Indicates whether the modal has a header template.
   */
  hasHeader = false;

  /**
   * Reference to the Document object for interacting with the DOM.
   */
  document: Document;

  /**
   * Indicates the origin path from modal.
   *
   */
  localized: URL;

  /**
   * A subscription to the router change url.
   */
  routerObservable!: Subscription;

  /**
   * Indicates the scroll position of the window.
   */
  scrollY = this.getWindow?.window()?.scrollY;

  /**
   * Creates an instance of `SqModalComponent`.
   * @constructor
   * @param {Document} documentImported - The injected Document object for DOM manipulation.
   * @param {Router} router - The Router service for programmatic navigation.
   * @param {GetWindow} getWindow - The GetWindow service for safely accessing the window object.
   */
  constructor(
    @Inject(DOCUMENT) public documentImported: Document,
    public router: Router,
    public getWindow: GetWindow
  ) {
    this.onKeydown = this.onKeydown.bind(this);
    this.document = documentImported || document;
    this.localized = new URL(this.getWindow.href());
  }

  /**
   * Lifecycle hook that detects changes to the 'open' input property and handles modal behavior accordingly.
   *
   * @param changes - The changes detected in the component's input properties.
   */
  async ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('open')) {
      const modal = this.modal;
      if (modal) {
        const body = this.document.getElementsByTagName('body')[0];
        const backdrop = this.document.getElementById('modal-backdrop') || this.document.createElement('div');
        if (this.open) {
          this.scrollY = this.getWindow?.window()?.scrollY;
          body.appendChild(modal.nativeElement);
          this.observeRouter();
          this.hasHeader = !!this.headerTemplate;
          body.classList.add('block');
          modal.nativeElement.style.display = 'flex';
          this.getWindow?.window()?.addEventListener('keydown', this.onKeydown);
          this.modals = this.document.getElementsByClassName('modal open');
          await sleep(10);
          this.modalNumber = this.modals?.length || 0;
          if (this.modalNumber <= 1) {
            backdrop.setAttribute('id', 'modal-backdrop');
            backdrop.setAttribute('class', 'modal-backdrop show');
            body.appendChild(backdrop);
          } else if (this.modalNumber > 1) {
            modal.nativeElement.style.zIndex = 1060 + this.modalNumber + 1;
            backdrop.setAttribute('style', `z-index: ${1060 + this.modalNumber};`);
          }
        } else {
          this.removeModalFromBody();
        }
      }
    }
  }

  /**
   * Performs actions before the component is destroyed.
   */
  ngOnDestroy(): void {
    this.routerObservable?.unsubscribe();
  }

  /**
   * Function that init the routerObservable.
   */
  observeRouter() {
    this.routerObservable = this.router.events.subscribe(async event => {
      if (event instanceof NavigationStart) {
        const destinationRoute = new URL(event.url, this.localized.origin);
        if (this.localized.origin + this.localized.pathname !== destinationRoute.origin + destinationRoute.pathname) {
          this.removeModalFromBody();
          await sleep(1000);
        }
      }
    });
  }

  /**
   * Removes the modal element from document body.
   */
  removeModalFromBody() {
    const body = this.document.getElementsByTagName('body')[0];
    if (this.modalNumber <= 1) {
      body?.classList?.remove('block');
      if (this.getWindow?.window()?.scrollY !== this.scrollY) {
        if (this.scrollY) this.getWindow?.window()?.scrollTo(0, this.scrollY);
      }
    }
    const backdrop = this.document.getElementById('modal-backdrop');
    const modal = this.document.getElementById(this.id);
    this.modalClose.emit();
    modal?.parentNode?.removeChild(modal);
    if (this.modalNumber === 2) {
      backdrop?.removeAttribute('style');
    } else if (this.modalNumber <= 1) {
      backdrop?.parentNode?.removeChild(backdrop);
    }
    this.getWindow?.window()?.removeEventListener('keydown', this.onKeydown);
  }

  /**
   * Handles keyboard events for the modal component.
   *
   * @param event - The keyboard event object.
   */
  onKeydown(event: KeyboardEvent) {
    if (this.open) {
      this.modals = this.document.getElementsByClassName('modal open');
      if (this.modals?.length && this.modals[this.modals.length - 1]?.id === this.id) {
        this.events(event.key);
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
        this.modalClose.emit();
        break;
      case 'ArrowLeft':
        this.leftPress.emit();
        break;
      case 'ArrowRight':
        this.rightPress.emit();
        break;
    }
  }
}
