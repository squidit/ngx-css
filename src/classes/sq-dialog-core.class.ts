import { DOCUMENT } from '@angular/common';
import {
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetWindow } from '../helpers/window.helper';
import { sleep } from '../helpers/sleep.helper';
import { SqDialogRef } from '../interfaces/modal.interface';

/**
 * Abstract base class for dialog components (modal and overlay).
 * Contains shared logic for backdrop management, keyboard events, scroll locking,
 * and dynamic content rendering.
 *
 * @abstract
 */
@Directive()
export abstract class SqDialogCore implements OnChanges, OnDestroy {
  // ============================================
  // Injected Services
  // ============================================

  /**
   * Reference to the document object.
   */
  protected document = inject(DOCUMENT);

  /**
   * Angular Router for navigation events.
   */
  protected router = inject(Router);

  /**
   * Window helper service for browser APIs.
   */
  protected getWindow = inject(GetWindow);

  // ============================================
  // Inputs - Common Configuration
  // ============================================

  /**
   * Unique identifier for the dialog instance.
   */
  @Input() id = `sq-dialog-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  /**
   * Controls whether the dialog is open or closed.
   */
  @Input() open = false;

  /**
   * Backdrop behavior.
   * - 'static': Clicking outside does not close the dialog
   * - true: Clicking outside closes the dialog
   */
  @Input() backdrop: 'static' | true = 'static';

  /**
   * Whether to show the close button.
   */
  @Input() showCloseButton = true;

  /**
   * Additional CSS class(es) to apply to the dialog container.
   */
  @Input() customClass = '';

  /**
   * Data-test attribute for testing purposes.
   */
  @Input() dataTest = 'sq-dialog';

  /**
   * Reference to the dialog for programmatic control.
   * Set by SqModalService when opening programmatically.
   */
  @Input() dialogRef?: SqDialogRef<any, any>;

  // ============================================
  // Inputs - Content Templates/Components
  // ============================================

  /**
   * Custom header content (TemplateRef or Component type).
   */
  @Input() headerContent?: TemplateRef<any> | Type<any>;

  /**
   * Custom body content (TemplateRef or Component type).
   */
  @Input() bodyContent?: TemplateRef<any> | Type<any>;

  /**
   * Custom footer content (TemplateRef or Component type).
   */
  @Input() footerContent?: TemplateRef<any> | Type<any>;

  /**
   * Data to pass to dynamic content components.
   */
  @Input() contentData?: any;

  /**
   * Text for the cancel button in the default footer.
   */
  @Input() cancelText = 'Cancelar';

  /**
   * Text for the confirm button in the default footer.
   */
  @Input() confirmText = 'Confirmar';

  // ============================================
  // Outputs
  // ============================================

  /**
   * Emitted when the dialog is closed.
   */
  @Output() dialogClose = new EventEmitter<void>();

  // ============================================
  // View References
  // ============================================

  /**
   * Reference to the dialog container element.
   */
  @ViewChild('dialogElement') dialogElement?: ElementRef<HTMLElement>;

  /**
   * Container for dynamic header content.
   */
  @ViewChild('headerContainer', { read: ViewContainerRef }) headerContainer?: ViewContainerRef;

  /**
   * Container for dynamic body content.
   */
  @ViewChild('bodyContainer', { read: ViewContainerRef }) bodyContainer?: ViewContainerRef;

  /**
   * Container for dynamic footer content.
   */
  @ViewChild('footerContainer', { read: ViewContainerRef }) footerContainer?: ViewContainerRef;

  // ============================================
  // Internal State
  // ============================================

  /**
   * Collection of open modal elements in the DOM.
   */
  protected modals?: HTMLCollectionOf<Element>;

  /**
   * Number of open modals (for stacking z-index).
   */
  protected modalNumber = 0;

  /**
   * Whether the dialog has header content.
   */
  hasHeader = false;

  /**
   * Whether the dialog has footer content.
   */
  hasFooter = false;

  /**
   * Original scroll position to restore on close.
   */
  protected scrollY?: number;

  /**
   * URL where the dialog was opened (for route change detection).
   */
  protected localized: URL;

  /**
   * Subscription to router events.
   */
  protected routerSubscription?: Subscription;

  /**
   * Flag to prevent duplicate close operations.
   */
  protected isClosing = false;

  /**
   * Whether this dialog is managed by SqModalService.
   * When true, DOM cleanup is handled by the service.
   * @internal
   */
  managedByService = false;

  /**
   * Unique style ID for dynamic CSS injection.
   * Must be implemented by subclasses that need to inject dynamic styles.
   */
  protected abstract styleId: string;

  /**
   * References to dynamically created content components.
   */
  protected contentComponentRefs: {
    header?: ComponentRef<any>;
    body?: ComponentRef<any>;
    footer?: ComponentRef<any>;
  } = {};

  // ============================================
  // Content Projection Templates (set by subclasses)
  // ============================================

  /**
   * Header template from content projection.
   * Subclasses should define with @ContentChild.
   */
  protected headerTemplate?: TemplateRef<any>;

  /**
   * Footer template from content projection.
   * Subclasses should define with @ContentChild.
   */
  protected footerTemplate?: TemplateRef<any>;

  // ============================================
  // Constructor
  // ============================================

  /**
   * Initializes the dialog core with keyboard event binding and URL parsing.
   */
  constructor() {
    this.onKeydown = this.onKeydown.bind(this);
    this.localized = new URL((this.getWindow.href() as string) || 'http://localhost');
  }

  // ============================================
  // Lifecycle Hooks
  // ============================================

  /**
   * Responds to input changes, opening or closing the dialog based on 'open' property.
   *
   * @param changes - The changed properties
   */
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['open']) {
      if (this.open) {
        await this.openDialog();
      } else {
        this.closeDialog();
      }
    }
  }

  /**
   * Cleans up resources when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.destroyContentComponents();
    this.getWindow.window()?.removeEventListener('keydown', this.onKeydown);
  }

  // ============================================
  // Abstract Methods (to be implemented by subclasses)
  // ============================================

  /**
   * Get CSS classes specific to the dialog type.
   *
   * @returns Object with CSS class names as keys and boolean values
   */
  abstract getDialogClasses(): Record<string, boolean>;

  /**
   * Get CSS classes for the modal-dialog element.
   *
   * @returns Object with CSS class names as keys and boolean values
   */
  abstract getModalDialogClasses(): Record<string, boolean>;

  /**
   * Hook for subclass-specific open logic.
   */
  protected abstract onDialogOpen(): void;

  /**
   * Hook for subclass-specific close logic.
   */
  protected abstract onDialogClose(): void;

  // ============================================
  // Public Methods
  // ============================================

  /**
   * Programmatically open the dialog.
   * Used by SqModalService.
   */
  async openDialog(): Promise<void> {
    if (!this.dialogElement) {
      return;
    }

    this.isClosing = false;
    const element = this.dialogElement.nativeElement;
    const body = this.document.body;
    const backdrop = this.document.getElementById('modal-backdrop') || this.document.createElement('div');

    // Save scroll position
    this.scrollY = this.getWindow.window()?.scrollY;

    // Append to body if not already there (only for declarative usage, not service-managed)
    if (!this.managedByService && element.parentNode !== body) {
      body.appendChild(element);
    }

    // Subscribe to router events
    this.observeRouter();

    // Determine if we have header/footer content
    this.hasHeader = !!this.headerContent;
    this.hasFooter = !!this.footerContent;

    // Render dynamic content
    this.renderDynamicContent();

    // Lock body scroll
    body.classList.add('block');

    // Show the dialog
    element.style.display = 'flex';

    // Add keyboard listener
    this.getWindow.window()?.addEventListener('keydown', this.onKeydown);

    // Get count of open modals
    this.modals = this.document.getElementsByClassName('modal open');
    await sleep(10);
    this.modalNumber = this.modals?.length || 0;

    // Handle backdrop
    if (this.modalNumber <= 1) {
      backdrop.setAttribute('id', 'modal-backdrop');
      backdrop.setAttribute('class', 'modal-backdrop show');
      body.appendChild(backdrop);
    } else if (this.modalNumber > 1) {
      element.style.zIndex = String(1060 + this.modalNumber + 1);
      backdrop.setAttribute('style', `z-index: ${1060 + this.modalNumber};`);
    }

    // Call subclass hook
    this.onDialogOpen();
  }

  /**
   * Programmatically close the dialog.
   * Used by SqModalService.
   */
  closeDialog(): void {
    if (this.isClosing) {
      return;
    }
    this.isClosing = true;

    const body = this.document.body;

    // Restore scroll position
    if (this.modalNumber <= 1) {
      body.classList.remove('block');
      if (this.scrollY !== undefined && this.getWindow.window()?.scrollY !== this.scrollY) {
        this.getWindow.window()?.scrollTo(0, this.scrollY);
      }
    }

    // Clean up backdrop
    const backdrop = this.document.getElementById('modal-backdrop');
    const element = this.document.getElementById(this.id);

    // Call subclass hook
    this.onDialogClose();

    // Emit close event only if not managed by service
    // (service handles its own close flow)
    if (!this.managedByService) {
      this.dialogClose.emit();
      element?.parentNode?.removeChild(element);
    }

    // Clean up backdrop based on modal count
    if (this.modalNumber === 2) {
      backdrop?.removeAttribute('style');
    } else if (this.modalNumber <= 1) {
      backdrop?.parentNode?.removeChild(backdrop);
    }

    // Remove keyboard listener
    this.getWindow.window()?.removeEventListener('keydown', this.onKeydown);

    // Destroy dynamic components
    this.destroyContentComponents();
  }

  /**
   * Handle click outside the dialog content.
   */
  onClickOutside(): void {
    if (this.backdrop !== 'static' && this.open) {
      this.dialogClose.emit();
    }
  }

  /**
   * Handle cancel button click in default footer.
   * Closes without returning a result (void/undefined).
   */
  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.dialogClose.emit();
    }
  }

  /**
   * Handle confirm button click in default footer.
   * Closes returning `true` as confirmation.
   */
  onConfirm(): void {
    if (this.dialogRef) {
      this.dialogRef.close(true);
    } else {
      this.dialogClose.emit();
    }
  }

  // ============================================
  // Protected Methods
  // ============================================

  /**
   * Subscribe to router events to close on navigation.
   */
  protected observeRouter(): void {
    this.routerSubscription?.unsubscribe();
    this.routerSubscription = this.router.events.subscribe(async event => {
      if (event instanceof NavigationStart) {
        const destinationRoute = new URL(event.url, this.localized.origin);
        if (this.localized.origin + this.localized.pathname !== destinationRoute.origin + destinationRoute.pathname) {
          this.closeDialog();
          await sleep(1000);
        }
      }
    });
  }

  /**
   * Handle keyboard events.
   *
   * @param event - The keyboard event
   */
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.open) {
      return;
    }

    this.modals = this.document.getElementsByClassName('modal open');
    if (this.modals?.length && this.modals[this.modals.length - 1]?.id === this.id) {
      if (event.key === 'Escape') {
        this.dialogClose.emit();
      }
    }
  }

  /**
   * Render dynamic content (TemplateRef or Component) into containers.
   */
  protected renderDynamicContent(): void {
    // Render header
    if (this.headerContent && this.headerContainer) {
      this.renderContent(this.headerContent, this.headerContainer, 'header');
    }

    // Render body
    if (this.bodyContent && this.bodyContainer) {
      this.renderContent(this.bodyContent, this.bodyContainer, 'body');
    }

    // Render footer
    if (this.footerContent && this.footerContainer) {
      this.renderContent(this.footerContent, this.footerContainer, 'footer');
    }
  }

  /**
   * Render a single content item (TemplateRef or Component).
   *
   * @param content - The content to render (TemplateRef or Component type)
   * @param container - The ViewContainerRef to render into
   * @param slot - The slot identifier ('header', 'body', or 'footer')
   */
  protected renderContent(
    content: TemplateRef<any> | Type<any>,
    container: ViewContainerRef,
    slot: 'header' | 'body' | 'footer'
  ): void {
    container.clear();

    if (this.isTemplateRef(content)) {
      // Render TemplateRef
      container.createEmbeddedView(content, {
        $implicit: this.dialogRef,
        dialogRef: this.dialogRef,
        data: this.contentData,
      });
    } else {
      // Render Component
      const componentRef = container.createComponent(content);

      // Pass data to component inputs
      if (this.contentData) {
        Object.keys(this.contentData).forEach(key => {
          if (key in componentRef.instance) {
            (componentRef.instance as any)[key] = this.contentData[key];
          }
        });
      }

      // Pass dialogRef if component accepts it
      if ('dialogRef' in componentRef.instance) {
        (componentRef.instance as any).dialogRef = this.dialogRef;
      }

      componentRef.changeDetectorRef.detectChanges();
      this.contentComponentRefs[slot] = componentRef;
    }
  }

  /**
   * Destroy all dynamically created content components.
   */
  protected destroyContentComponents(): void {
    Object.values(this.contentComponentRefs).forEach(ref => {
      ref?.destroy();
    });
    this.contentComponentRefs = {};
  }

  /**
   * Type guard to check if content is a TemplateRef.
   *
   * @param content - The content to check
   * @returns True if content is a TemplateRef
   */
  protected isTemplateRef(content: TemplateRef<any> | Type<any>): content is TemplateRef<any> {
    return content instanceof TemplateRef;
  }

  /**
   * Get template context for ng-template outlets.
   *
   * @returns Context object with dialogRef and data
   */
  get templateContext(): any {
    return {
      $implicit: this.dialogRef,
      dialogRef: this.dialogRef,
      data: this.contentData,
    };
  }

  // ============================================
  // Computed Properties for Templates
  // ============================================

  /**
   * Computed header: prioritizes headerContent input over content projection.
   *
   * @returns The effective header template or null
   */
  get effectiveHeaderTemplate(): TemplateRef<any> | null {
    if (this.headerContent && this.isTemplateRef(this.headerContent)) {
      return this.headerContent;
    }
    return this.headerTemplate || null;
  }

  /**
   * Computed footer: prioritizes footerContent input over content projection.
   *
   * @returns The effective footer template or null
   */
  get effectiveFooterTemplate(): TemplateRef<any> | null {
    if (this.footerContent && this.isTemplateRef(this.footerContent)) {
      return this.footerContent;
    }
    return this.footerTemplate || null;
  }

  /**
   * Whether to show header section.
   *
   * @returns True if header should be displayed
   */
  get showHeader(): boolean {
    return !!this.effectiveHeaderTemplate || !!this.headerContent || this.showCloseButton;
  }

  /**
   * Whether to show footer section.
   *
   * @returns True if footer should be displayed
   */
  get showFooter(): boolean {
    return !!this.effectiveFooterTemplate || !!this.footerContent || this.shouldShowDefaultFooter;
  }

  /**
   * Whether to show the default footer with cancel/confirm buttons.
   * Shows when no custom footer template or component is provided.
   *
   * @returns True if default footer should be displayed
   */
  get shouldShowDefaultFooter(): boolean {
    return !this.effectiveFooterTemplate && !this.footerContent;
  }

  /**
   * Check if header content is a component (not template).
   *
   * @returns True if headerContent is a Component type
   */
  get hasHeaderComponent(): boolean {
    return !!this.headerContent && !this.isTemplateRef(this.headerContent);
  }

  /**
   * Check if body content is a component (not template).
   *
   * @returns True if bodyContent is a Component type
   */
  get hasBodyComponent(): boolean {
    return !!this.bodyContent && !this.isTemplateRef(this.bodyContent);
  }

  /**
   * Check if footer content is a component (not template).
   *
   * @returns True if footerContent is a Component type
   */
  get hasFooterComponent(): boolean {
    return !!this.footerContent && !this.isTemplateRef(this.footerContent);
  }

  /**
   * Check if body content is a template.
   *
   * @returns The body template or null
   */
  get bodyTemplate(): TemplateRef<any> | null {
    if (this.bodyContent && this.isTemplateRef(this.bodyContent)) {
      return this.bodyContent;
    }
    return null;
  }
}
