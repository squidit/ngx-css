import { DOCUMENT, NgClass, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
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
  ViewContainerRef,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetWindow } from '../../helpers/window.helper';
import { sleep } from '../../helpers/sleep.helper';
import { SqClickOutsideDirective } from '../../directives/sq-click-outside/sq-click-outside.directive';
import { SqDataTestDirective } from '../../directives/sq-data-test/sq-data-test.directive';
import { SqButtonComponent } from '../sq-button/sq-button.component';

/**
 * Unified base component for modals and overlays.
 * Can be used directly or managed by SqModalManagerService.
 *
 * @example
 * // As modal (centered)
 * <sq-modal-base [open]="isOpen" type="modal" size="lg" (modalClose)="onClose()">
 *   <ng-template #headerModal>Title</ng-template>
 *   <div>Content</div>
 *   <ng-template #footerModal>Footer</ng-template>
 * </sq-modal-base>
 *
 * @example
 * // As overlay (side panel)
 * <sq-modal-base [open]="isOpen" type="overlay" direction="right" (modalClose)="onClose()">
 *   <ng-template #headerModal>Title</ng-template>
 *   <div>Content</div>
 * </sq-modal-base>
 */
@Component({
  selector: 'sq-modal-base',
  templateUrl: './sq-modal-base.component.html',
  styleUrls: ['./sq-modal-base.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, NgStyle, NgTemplateOutlet, SqClickOutsideDirective, SqDataTestDirective, SqButtonComponent],
})
export class SqModalBaseComponent implements OnChanges, OnDestroy {
  /**
   * Unique identifier for the modal.
   */
  @Input() id = `modal-base-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Controls if the modal is open or closed.
   */
  @Input() open?: boolean;

  /**
   * Type of modal: 'modal' (centered) or 'overlay' (side panel).
   */
  @Input() type: 'modal' | 'overlay' = 'modal';

  /**
   * Size of the modal (only for type='modal').
   */
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen' = 'md';

  /**
   * Direction of the overlay (only for type='overlay').
   */
  @Input() direction: 'left' | 'right' | 'top' | 'bottom' = 'right';

  /**
   * Width of the overlay (only for type='overlay').
   */
  @Input() width = '475px';

  /**
   * Backdrop behavior: 'static' (no close on click outside) or 'true' (close on click outside).
   */
  @Input() backdrop: 'static' | 'true' = 'static';

  /**
   * Show/hide close button.
   */
  @Input() showCloseButton = true;

  /**
   * Additional CSS class for the modal element.
   */
  @Input() customClass = '';

  /**
   * Additional CSS class for the backdrop element.
   */
  @Input() backdropClass = '';

  /**
   * Header padding.
   */
  @Input() headerPadding = '';

  /**
   * Body padding.
   */
  @Input() bodyPadding = '';

  /**
   * Footer padding.
   */
  @Input() footerPadding = '';

  /**
   * Header background color.
   */
  @Input() headerBgColor = '';

  /**
   * Body background color.
   */
  @Input() bodyBgColor = '';

  /**
   * Footer background color.
   */
  @Input() footerBgColor = '';

  /**
   * Remove borders (for overlay).
   */
  @Input() borderless = false;

  /**
   * Header items text color (for overlay).
   */
  @Input() headerItemsColor = '';

  /**
   * Data-test attribute value.
   */
  @Input() dataTest = 'sq-modal-base';

  /**
   * Event emitted when the modal is closed.
   */
  @Output() modalClose = new EventEmitter<void>();

  /**
   * Event emitted when the left arrow key is pressed.
   */
  @Output() leftPress = new EventEmitter<void>();

  /**
   * Event emitted when the right arrow key is pressed.
   */
  @Output() rightPress = new EventEmitter<void>();

  /**
   * Reference to the modal element in the template.
   */
  @ViewChild('modalElement') modalElement: ElementRef | null = null;

  /**
   * Container for dynamically injected content components.
   */
  @ViewChild('dynamicContent', { read: ViewContainerRef }) dynamicContentContainer?: ViewContainerRef;

  /**
   * Reference to the header template (via content projection).
   */
  @ContentChild('headerModal') headerTemplateFromContent?: TemplateRef<ElementRef> | null = null;

  /**
   * Reference to the footer template (via content projection).
   */
  @ContentChild('footerModal') footerTemplateFromContent?: TemplateRef<ElementRef> | null = null;

  /**
   * Header template passed programmatically (takes precedence over content projection).
   */
  @Input() headerTemplateInput?: TemplateRef<any> | null = null;

  /**
   * Footer template passed programmatically (takes precedence over content projection).
   */
  @Input() footerTemplateInput?: TemplateRef<any> | null = null;

  /**
   * Computed header template (prioritizes input over content).
   */
  get headerTemplate(): TemplateRef<any> | null | undefined {
    return this.headerTemplateInput || this.headerTemplateFromContent;
  }

  /**
   * Computed footer template (prioritizes input over content).
   */
  get footerTemplate(): TemplateRef<any> | null | undefined {
    return this.footerTemplateInput || this.footerTemplateFromContent;
  }

  /**
   * Collection of open modal elements.
   */
  modals: HTMLCollectionOf<Element> | undefined;

  /**
   * Number of open modals.
   */
  modalNumber = 0;

  /**
   * Whether the modal has a header.
   */
  hasHeader = false;

  /**
   * Whether the modal has a footer.
   */
  hasFooter = false;

  /**
   * Whether the overlay has finished opening (for animation).
   */
  finishOpening = false;

  /**
   * Document reference.
   */
  document: Document;

  /**
   * Original URL for route tracking.
   */
  localized: URL;

  /**
   * Router subscription.
   */
  routerObservable!: Subscription;

  /**
   * Saved scroll position.
   */
  scrollY = this.getWindow?.window()?.scrollY;

  /**
   * Unique style ID for dynamic CSS (overlay width).
   */
  styleId = `modal-base-style-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  /**
   * Initializes the component with required dependencies.
   * @param documentImported - The document object
   * @param router - Angular Router for navigation tracking
   * @param getWindow - Window helper service
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
   * Lifecycle hook that detects changes to input properties.
   */
  async ngOnChanges(changes: SimpleChanges) {
    // Handle width changes for overlay
    if (changes.hasOwnProperty('width') && this.open && this.type === 'overlay') {
      this.doCssWidth();
    }

    // Handle open/close state changes
    if (changes.hasOwnProperty('open')) {
      const element = this.modalElement;
      if (element) {
        const body = this.document.getElementsByTagName('body')[0];
        const backdrop = this.document.getElementById('modal-backdrop') || this.document.createElement('div');

        if (this.open) {
          // Opening modal
          this.scrollY = this.getWindow?.window()?.scrollY;
          body.appendChild(element.nativeElement);
          this.observeRouter();

          if (this.type === 'overlay') {
            this.doCssWidth();
          }

          this.hasHeader = !!this.headerTemplate || this.shouldShowDefaultHeader;
          this.hasFooter = !!this.footerTemplate || this.shouldShowDefaultFooter;

          body.classList.add('block');
          element.nativeElement.style.display = 'flex';
          this.getWindow?.window()?.addEventListener('keydown', this.onKeydown);

          this.modals = this.document.getElementsByClassName('modal open');
          await sleep(10);

          this.modalNumber = this.modals?.length || 0;

          if (this.modalNumber <= 1) {
            backdrop.setAttribute('id', 'modal-backdrop');
            backdrop.setAttribute('class', 'modal-backdrop show');
            body.appendChild(backdrop);
          } else if (this.modalNumber > 1) {
            element.nativeElement.style.zIndex = 1060 + this.modalNumber + 1;
            backdrop.setAttribute('style', `z-index: ${1060 + this.modalNumber};`);
          }

          if (this.type === 'overlay') {
            this.finishOpening = true;
          }
        } else {
          // Closing modal
          this.removeModalFromBody();
        }
      }
    }
  }

  /**
   * Cleanup on component destroy.
   */
  ngOnDestroy(): void {
    this.routerObservable?.unsubscribe();
    if (this.type === 'overlay') {
      this.undoCssWidth();
    }
  }

  /**
   * Observe router events to close modal on navigation.
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
   * Programmatically open the modal (for use by SqModalManagerService).
   * This bypasses ngOnChanges and directly triggers the opening logic.
   */
  async openModal() {
    this.isClosing = false;
    this.open = true;
    await this.triggerOpenLogic();
  }

  /**
   * Flag indicating if this modal is managed by SqModalManagerService.
   * When true, the component won't try to remove itself from DOM.
   */
  @Input() managedByService = false;

  /**
   * Internal flag to prevent multiple close operations.
   */
  private isClosing = false;

  /**
   * Modal reference to be passed to templates via context.
   * This allows templates to access modal methods like close().
   */
  @Input() modalRef?: any;

  /**
   * Title to display in the default header.
   */
  @Input() title?: string;

  /**
   * Text for cancel button in default footer.
   */
  @Input() cancelButtonText = 'Fechar';

  /**
   * Text for confirm button in default footer.
   */
  @Input() confirmButtonText = 'Concluir';

  /**
   * Show default footer buttons.
   */
  @Input() showFooterButtons = true;

  /**
   * Context object passed to header and footer templates.
   * Contains the modalRef so templates can close the modal.
   */
  get templateContext() {
    return {
      $implicit: this.modalRef,
      modalRef: this.modalRef,
    };
  }

  /**
   * Check if should show default header (has title but no custom template).
   */
  get shouldShowDefaultHeader(): boolean {
    return !!this.title && !this.headerTemplate;
  }

  /**
   * Check if should show default footer (no custom template and showFooterButtons is true).
   */
  get shouldShowDefaultFooter(): boolean {
    return this.showFooterButtons && !this.footerTemplate;
  }

  /**
   * Programmatically close the modal (for use by SqModalManagerService).
   */
  closeModal() {
    // Prevent multiple close operations
    if (this.isClosing) {
      return;
    }
    this.isClosing = true;

    this.open = false;

    // If managed by service, just hide modal - don't emit event
    // The service already handles everything
    if (this.managedByService) {
      const element = this.modalElement;

      // Hide the modal
      if (element?.nativeElement) {
        element.nativeElement.style.display = 'none';
        element.nativeElement.classList.remove('open');

        if (element.nativeElement.parentNode?.nodeName === 'SQ-MODAL-BASE') {
          (element.nativeElement.parentNode as HTMLElement).style.display = 'none';
        }
      }

      // Remove keydown listener
      this.getWindow?.window()?.removeEventListener('keydown', this.onKeydown);
    } else {
      // Traditional usage: remove from DOM
      this.removeModalFromBody();
    }
  }

  /**
   * Internal method to execute the modal opening logic.
   */
  private async triggerOpenLogic() {
    const element = this.modalElement;

    if (!element) {
      return;
    }

    const body = this.document.getElementsByTagName('body')[0];
    const backdrop = this.document.getElementById('modal-backdrop') || this.document.createElement('div');

    // Opening modal
    this.scrollY = this.getWindow?.window()?.scrollY;

    // Only append if not already in DOM (service should have already attached it)
    if (!element.nativeElement.parentNode) {
      body.appendChild(element.nativeElement);
    }

    this.observeRouter();

    if (this.type === 'overlay') {
      this.doCssWidth();
    }

    this.hasHeader = !!this.headerTemplate || this.shouldShowDefaultHeader;
    this.hasFooter = !!this.footerTemplate || this.shouldShowDefaultFooter;

    body.classList.add('block');
    element.nativeElement.style.display = 'flex';
    element.nativeElement.classList.add('open');

    if (element.nativeElement.parentNode?.nodeName === 'SQ-MODAL-BASE') {
      const sqModalBaseElement = element.nativeElement.parentNode as HTMLElement;
      sqModalBaseElement.style.display = 'block';
    }

    this.getWindow?.window()?.addEventListener('keydown', this.onKeydown);

    this.modals = this.document.getElementsByClassName('modal open');
    await sleep(10);

    this.modalNumber = this.modals?.length || 0;

    if (this.modalNumber <= 1) {
      backdrop.setAttribute('id', 'modal-backdrop');
      backdrop.setAttribute('class', 'modal-backdrop show');
      body.appendChild(backdrop);
    } else if (this.modalNumber > 1) {
      element.nativeElement.style.zIndex = 1060 + this.modalNumber + 1;
      backdrop.setAttribute('style', `z-index: ${1060 + this.modalNumber};`);
    }

    if (this.type === 'overlay') {
      this.finishOpening = true;
    }
  }

  /**
   * Remove modal element from document body.
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

    if (this.type === 'overlay') {
      this.finishOpening = false;
      this.undoCssWidth();
    }

    modal?.parentNode?.removeChild(modal);

    if (this.modalNumber === 2) {
      backdrop?.removeAttribute('style');
    } else if (this.modalNumber <= 1) {
      backdrop?.parentNode?.removeChild(backdrop);
    }

    this.getWindow?.window()?.removeEventListener('keydown', this.onKeydown);
  }

  /**
   * Handle keyboard events.
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
   * Handle specific key events.
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

  /**
   * Apply dynamic CSS for overlay width.
   */
  doCssWidth() {
    const css = `
      .overlay.open .modal-dialog.opened {
        width: ${this.width};
      }
    `;
    const head = this.document.getElementsByTagName('head')[0];
    let style = this.document.getElementById(this.styleId);
    if (!style) {
      style = this.document.createElement('style');
      style.setAttribute('id', this.styleId);
      style.appendChild(this.document.createTextNode(css));
      head.appendChild(style);
    } else {
      style.innerHTML = '';
      style.appendChild(this.document.createTextNode(css));
    }
  }

  /**
   * Remove dynamic CSS for overlay width.
   */
  undoCssWidth() {
    const style = this.document.getElementById(this.styleId);
    if (style?.parentNode) {
      style.parentNode.removeChild(style);
    }
  }

  /**
   * Handle click outside logic for overlay.
   */
  handleClickOutside() {
    if (this.type === 'overlay' && this.open && this.backdrop !== 'static') {
      this.modalClose.emit();
    }
  }

  /**
   * Get computed CSS classes for the modal container.
   */
  get containerClasses(): any {
    const classes: any = {
      open: this.open,
    };

    if (this.type === 'overlay') {
      classes['overlay'] = true;
      classes[this.direction] = true;
    }

    return classes;
  }

  /**
   * Get computed CSS classes for the modal dialog.
   */
  get dialogClasses(): any {
    const classes: any = {};

    if (this.type === 'modal') {
      classes[`modal-${this.size}`] = true;
    } else {
      classes[this.direction] = true;
      classes['opened'] = this.finishOpening;
    }

    return classes;
  }

  /**
   * Get computed CSS classes for the modal header.
   */
  get headerClasses(): any {
    return {
      'without-header': !this.hasHeader,
      borderless: this.borderless && this.type === 'overlay',
    };
  }

  /**
   * Get computed CSS classes for the modal body.
   */
  get bodyClasses(): any {
    return {
      'without-footer': !this.hasFooter && this.type === 'overlay',
    };
  }

  /**
   * Get computed CSS classes for the modal footer.
   */
  get footerClasses(): any {
    return {
      borderless: this.borderless && this.type === 'overlay',
    };
  }

  /**
   * Get computed styles for the modal container.
   */
  get containerStyles(): any {
    if (this.type === 'overlay') {
      return {};
    }
    return {};
  }

  /**
   * Get computed styles for the dialog.
   */
  get dialogStyles(): any {
    if (this.type === 'overlay') {
      return {
        'background-color': this.headerBgColor || 'var(--background_secondary)',
      };
    }
    return {};
  }
}
