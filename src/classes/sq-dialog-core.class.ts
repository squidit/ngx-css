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
   * Whether to show the header section.
   */
  @Input() showHeaderInput = true;

  /**
   * Whether to show the footer section.
   */
  @Input() showFooterInput = true;

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
   * Custom header content.
   * Can be a string (used as title) or TemplateRef.
   * If body is a Component with headerTemplate property, it will be used automatically.
   */
  @Input() headerContent?: string | TemplateRef<any>;

  /**
   * Custom body content (TemplateRef or Component type).
   * If a Component is passed, its headerTemplate and footerTemplate properties will be used.
   */
  @Input() bodyContent?: TemplateRef<any> | Type<any>;

  /**
   * Custom footer content (string or TemplateRef).
   * If body is a Component with footerTemplate property, it will be used automatically.
   */
  @Input() footerContent?: TemplateRef<any>;

  /**
   * Data to pass to dynamic content components.
   */
  @Input() contentData?: any;

  /**
   * Output handlers for the body component (when body is a Component).
   * Keys must match the body component's @Output() EventEmitter names.
   */
  @Input() contentOutputs?: { [outputName: string]: (value?: any) => void };

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
   * Container for dynamic body content.
   */
  @ViewChild('bodyContainer', { read: ViewContainerRef }) bodyContainer?: ViewContainerRef;

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
   * Header template extracted from body component (if any).
   */
  protected bodyComponentHeaderTemplate?: TemplateRef<any>;

  /**
   * Footer template extracted from body component (if any).
   */
  protected bodyComponentFooterTemplate?: TemplateRef<any>;

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

  /**
   * Subscriptions to body component outputs (for cleanup on destroy).
   */
  protected contentOutputSubscriptions: Subscription[] = [];

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
   * Only body supports Component type. Header and footer support only string/TemplateRef.
   * If body is a Component with headerTemplate/footerTemplate properties, they will be extracted.
   */
  protected renderDynamicContent(): void {
    // Render body (supports both TemplateRef and Component)
    if (this.bodyContent && this.bodyContainer) {
      this.renderContent(this.bodyContent, this.bodyContainer, 'body');
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

      // Subscribe to body component outputs if provided
      if (slot === 'body' && this.contentOutputs) {
        Object.keys(this.contentOutputs).forEach(outputName => {
          const emitter = (componentRef.instance as any)[outputName];
          const handler = this.contentOutputs![outputName];
          if (emitter && typeof emitter?.subscribe === 'function' && typeof handler === 'function') {
            this.contentOutputSubscriptions.push(emitter.subscribe((value: any) => handler(value)));
          }
        });
      }

      // Extract header/footer templates from body component if available
      if (slot === 'body') {
        this.extractTemplatesFromBodyComponent(componentRef.instance);
      }
    }
  }

  /**
   * Extract headerTemplate and footerTemplate from body component if they exist.
   *
   * @param componentInstance - The body component instance
   */
  protected extractTemplatesFromBodyComponent(componentInstance: any): void {
    // Extract header template if exists and no header content was provided
    if ('headerTemplate' in componentInstance && componentInstance.headerTemplate) {
      this.bodyComponentHeaderTemplate = componentInstance.headerTemplate;
    }

    // Extract footer template if exists and no footer content was provided
    if ('footerTemplate' in componentInstance && componentInstance.footerTemplate) {
      this.bodyComponentFooterTemplate = componentInstance.footerTemplate;
    }
  }

  /**
   * Re-applies contentData to the body component's inputs.
   * Call this when contentData is updated (e.g. via dialogRef.updateData()) so the body reflects the new values.
   */
  applyContentDataToBody(): void {
    const bodyRef = this.contentComponentRefs.body;
    if (!bodyRef || !this.contentData) {
      return;
    }
    Object.keys(this.contentData).forEach(key => {
      if (key in bodyRef.instance) {
        (bodyRef.instance as any)[key] = this.contentData[key];
      }
    });
    bodyRef.changeDetectorRef.detectChanges();
  }

  /**
   * Destroy all dynamically created content components.
   */
  protected destroyContentComponents(): void {
    this.contentOutputSubscriptions.forEach(sub => sub.unsubscribe());
    this.contentOutputSubscriptions = [];
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
   * Header title when headerContent is a string.
   * Returns null if body component has a headerTemplate (internal overrides external).
   *
   * @returns The header title string or null
   */
  get headerTitle(): string | null {
    // Body component's headerTemplate takes priority over external string
    if (this.bodyComponentHeaderTemplate) {
      return null;
    }
    if (typeof this.headerContent === 'string') {
      return this.headerContent;
    }
    return null;
  }

  /**
   * Computed header: prioritizes body component's headerTemplate (internal),
   * then falls back to external headerContent or content projection.
   * Returns null if headerContent is a string (use headerTitle instead).
   *
   * @returns The effective header template or null
   */
  get effectiveHeaderTemplate(): TemplateRef<any> | null {
    // Priority 1: Template from body component (internal overrides external)
    if (this.bodyComponentHeaderTemplate) {
      return this.bodyComponentHeaderTemplate;
    }
    // Priority 2: headerContent (TemplateRef)
    if (this.headerContent && typeof this.headerContent !== 'string' && this.isTemplateRef(this.headerContent)) {
      return this.headerContent;
    }
    // Priority 3: Content projection
    return this.headerTemplate || null;
  }

  /**
   * Computed footer: prioritizes body component's footerTemplate (internal),
   * then falls back to external footerContent or content projection.
   *
   * @returns The effective footer template or null
   */
  get effectiveFooterTemplate(): TemplateRef<any> | null {
    // Priority 1: Template from body component (internal overrides external)
    if (this.bodyComponentFooterTemplate) {
      return this.bodyComponentFooterTemplate;
    }
    // Priority 2: footerContent (TemplateRef)
    if (this.footerContent && this.isTemplateRef(this.footerContent)) {
      return this.footerContent;
    }
    // Priority 3: Content projection
    return this.footerTemplate || null;
  }

  /**
   * Whether to show header section.
   *
   * @returns True if header should be displayed
   */
  get showHeader(): boolean {
    if (this.showHeaderInput === false) {
      return false;
    }
    return !!this.effectiveHeaderTemplate || !!this.headerContent || this.showCloseButton;
  }

  /**
   * Whether to show footer section.
   *
   * @returns True if footer should be displayed
   */
  get showFooter(): boolean {
    if (this.showFooterInput === false) {
      return false;
    }
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
   * Check if header content is a component.
   * Always returns false as header only supports string or TemplateRef.
   *
   * @returns Always false
   * @deprecated Header no longer supports Component type
   */
  get hasHeaderComponent(): boolean {
    return false;
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
   * Check if footer content is a component.
   * Always returns false as footer only supports TemplateRef.
   *
   * @returns Always false
   * @deprecated Footer no longer supports Component type
   */
  get hasFooterComponent(): boolean {
    return false;
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
