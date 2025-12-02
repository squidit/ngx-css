import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SqDialogInstance, SqDialogRef, SqModalConfig, SqOverlayConfig } from '../interfaces/modal.interface';
import { SqModalBaseComponent } from '../components/sq-modal-base/sq-modal-base.component';
import { SqOverlayBaseComponent } from '../components/sq-overlay-base/sq-overlay-base.component';

/**
 * Service for programmatically opening and managing modal/overlay dialogs.
 *
 * @example
 * ```typescript
 * // Inject the service
 * constructor(private modalService: SqModalService) {}
 *
 * // Open a modal with a component as body
 * openModal() {
 *   const ref = this.modalService.openModal({
 *     size: 'lg',
 *     body: MyContentComponent,
 *     data: { title: 'Hello', items: [...] }
 *   });
 *
 *   ref.afterClosed().subscribe(result => {
 *     console.log('Modal closed with:', result);
 *   });
 * }
 *
 * // Open an overlay
 * openOverlay() {
 *   const ref = this.modalService.openOverlay({
 *     direction: 'right',
 *     width: '500px',
 *     body: MyPanelComponent,
 *     data: { filters: {...} }
 *   });
 * }
 *
 * // Close from inside the content component
 * // In MyContentComponent:
 * @Input() dialogRef?: SqDialogRef;
 *
 * save() {
 *   this.dialogRef?.close({ saved: true });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SqModalService {
  /**
   * Environment injector for creating dynamic components.
   */
  private injector = inject(EnvironmentInjector);

  /**
   * Application reference for attaching views.
   */
  private appRef = inject(ApplicationRef);

  /**
   * Map of all currently open dialog instances.
   */
  private dialogs = new Map<string, SqDialogInstance<any, any>>();

  /**
   * Counter to generate unique dialog IDs.
   */
  private dialogCounter = 0;

  /**
   * Subject that emits when a dialog is opened.
   */
  readonly dialogOpened$ = new Subject<{ id: string; type: 'modal' | 'overlay' }>();

  /**
   * Subject that emits when a dialog is closed.
   */
  readonly dialogClosed$ = new Subject<{ id: string; result?: any }>();

  /**
   * Open a modal dialog.
   *
   * @param config - Configuration for the modal
   * @returns Reference to the opened dialog
   */
  openModal<T = any, R = any>(config: SqModalConfig<T> = {}): SqDialogRef<T, R> {
    return this.open<T, R>('modal', config);
  }

  /**
   * Open an overlay (side panel) dialog.
   *
   * @param config - Configuration for the overlay
   * @returns Reference to the opened dialog
   */
  openOverlay<T = any, R = any>(config: SqOverlayConfig<T> = {}): SqDialogRef<T, R> {
    return this.open<T, R>('overlay', config);
  }

  /**
   * Close a specific dialog by ID.
   *
   * @param id - The dialog ID to close
   * @param result - Optional result to pass to afterClosed subscribers
   */
  close(id: string, result?: any): void {
    const instance = this.dialogs.get(id);
    if (!instance) {
      return;
    }

    this.closeInstance(instance, result);
  }

  /**
   * Close all open dialogs.
   */
  closeAll(): void {
    const ids = Array.from(this.dialogs.keys());
    ids.forEach(id => this.close(id));
  }

  /**
   * Get the number of currently open dialogs.
   */
  get openCount(): number {
    return this.dialogs.size;
  }

  /**
   * Check if a specific dialog is open.
   */
  isOpen(id: string): boolean {
    return this.dialogs.has(id);
  }

  /**
   * Internal method to open a dialog of any type.
   */
  private open<T, R>(type: 'modal' | 'overlay', config: SqModalConfig<T> | SqOverlayConfig<T>): SqDialogRef<T, R> {
    const id = config.id || `sq-dialog-${++this.dialogCounter}-${Date.now()}`;
    const resultSubject = new Subject<R | undefined>();

    // Create the dialog instance
    const instance: SqDialogInstance<T, R> = {
      id,
      type,
      config,
      resultSubject,
    };

    // Store the instance
    this.dialogs.set(id, instance);

    // Create the dialog reference
    const dialogRef = this.createDialogRef<T, R>(instance);

    // Create and attach the component
    this.createDialogComponent(instance, dialogRef);

    // Emit opened event
    this.dialogOpened$.next({ id, type });

    return dialogRef;
  }

  /**
   * Create a dialog reference object.
   */
  private createDialogRef<T, R>(instance: SqDialogInstance<T, R>): SqDialogRef<T, R> {
    return new SqDialogRef<T, R>(
      instance.id,
      instance.resultSubject,
      (result?: R) => this.close(instance.id, result),
      (data: Partial<T>) => this.updateData(instance.id, data)
    );
  }

  /**
   * Create the dialog component and attach it to the DOM.
   */
  private createDialogComponent<T, R>(instance: SqDialogInstance<T, R>, dialogRef: SqDialogRef<T, R>): void {
    if (instance.type === 'modal') {
      this.createModalComponent(instance, dialogRef);
    } else {
      this.createOverlayComponent(instance, dialogRef);
    }
  }

  /**
   * Create a modal component.
   */
  private createModalComponent<T, R>(instance: SqDialogInstance<T, R>, dialogRef: SqDialogRef<T, R>): void {
    const componentRef = createComponent(SqModalBaseComponent, {
      environmentInjector: this.injector,
    });

    instance.componentRef = componentRef;
    const componentInstance = componentRef.instance;

    // Configure common properties
    this.configureCommonProperties(componentInstance, instance, dialogRef);

    // Apply modal-specific config
    const modalConfig = instance.config as SqModalConfig<T>;
    if (modalConfig.size) {
      componentInstance.size = modalConfig.size;
    }

    // Attach and open
    this.attachAndOpen(componentRef, instance);
  }

  /**
   * Create an overlay component.
   */
  private createOverlayComponent<T, R>(instance: SqDialogInstance<T, R>, dialogRef: SqDialogRef<T, R>): void {
    const componentRef = createComponent(SqOverlayBaseComponent, {
      environmentInjector: this.injector,
    });

    instance.componentRef = componentRef;
    const componentInstance = componentRef.instance;

    // Configure common properties
    this.configureCommonProperties(componentInstance, instance, dialogRef);

    // Apply overlay-specific config
    const overlayConfig = instance.config as SqOverlayConfig<T>;
    if (overlayConfig.direction) {
      componentInstance.direction = overlayConfig.direction;
    }
    if (overlayConfig.width) {
      componentInstance.width = overlayConfig.width;
    }
    if (overlayConfig.borderless !== undefined) {
      componentInstance.borderless = overlayConfig.borderless;
    }

    // Attach and open
    this.attachAndOpen(componentRef, instance);
  }

  /**
   * Configure common properties on a dialog component.
   */
  private configureCommonProperties<T, R>(
    componentInstance: SqModalBaseComponent | SqOverlayBaseComponent,
    instance: SqDialogInstance<T, R>,
    dialogRef: SqDialogRef<T, R>
  ): void {
    componentInstance.id = instance.id;
    componentInstance.managedByService = true;
    componentInstance.dialogRef = dialogRef;

    // Apply common config
    if (instance.config.backdrop !== undefined) {
      componentInstance.backdrop = instance.config.backdrop;
    }
    if (instance.config.showCloseButton !== undefined) {
      componentInstance.showCloseButton = instance.config.showCloseButton;
    }
    if (instance.config.customClass) {
      componentInstance.customClass = instance.config.customClass;
    }
    if (instance.config.dataTest) {
      componentInstance.dataTest = instance.config.dataTest;
    }

    // Apply content
    if (instance.config.header) {
      componentInstance.headerContent = instance.config.header;
    }
    if (instance.config.body) {
      componentInstance.bodyContent = instance.config.body;
    }
    if (instance.config.footer) {
      componentInstance.footerContent = instance.config.footer;
    }
    if (instance.config.data) {
      componentInstance.contentData = instance.config.data;
    }

    // Apply footer button texts
    if (instance.config.cancelText) {
      componentInstance.cancelText = instance.config.cancelText;
    }
    if (instance.config.confirmText) {
      componentInstance.confirmText = instance.config.confirmText;
    }
  }

  /**
   * Attach component to DOM and open the dialog.
   */
  private attachAndOpen<T, R>(
    componentRef: ComponentRef<SqModalBaseComponent | SqOverlayBaseComponent>,
    instance: SqDialogInstance<T, R>
  ): void {
    const componentInstance = componentRef.instance;

    // Subscribe to close event (only once, and check if still in dialogs map)
    const subscription = componentInstance.dialogClose.subscribe(() => {
      subscription.unsubscribe();
      if (this.dialogs.has(instance.id)) {
        this.close(instance.id);
      }
    });

    // Attach view to Angular's change detection
    this.appRef.attachView(componentRef.hostView);

    // Get the host element and append to body
    const hostElement = componentRef.location.nativeElement as HTMLElement;
    document.body.appendChild(hostElement);

    // Set open state and trigger rendering
    componentInstance.open = true;

    // Detect changes to render the component content
    componentRef.changeDetectorRef.detectChanges();

    // Call openDialog to handle backdrop, scroll lock, etc.
    componentInstance.openDialog();
  }

  /**
   * Update data in a dialog's content components.
   */
  private updateData<T>(id: string, data: Partial<T>): void {
    const instance = this.dialogs.get(id);
    if (!instance) {
      return;
    }

    // Update contentData on the dialog component
    if (instance.componentRef) {
      const componentInstance = instance.componentRef.instance;
      componentInstance.contentData = {
        ...componentInstance.contentData,
        ...data,
      };
      instance.componentRef.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Close a dialog instance and clean up resources.
   */
  private closeInstance<T, R>(instance: SqDialogInstance<T, R>, result?: R): void {
    // Remove from map first to prevent duplicate closes
    this.dialogs.delete(instance.id);

    // Emit result
    instance.resultSubject.next(result);
    instance.resultSubject.complete();

    // Close the component
    if (instance.componentRef) {
      const componentRef = instance.componentRef;
      const componentInstance = componentRef.instance;
      const hostElement = componentRef.location.nativeElement as HTMLElement;

      // Call closeDialog directly (ngOnChanges won't fire when setting properties programmatically)
      componentInstance.open = false;
      componentInstance.closeDialog();

      // Wait for close animation, then cleanup
      setTimeout(() => {
        // Remove from DOM
        if (hostElement?.parentNode) {
          hostElement.parentNode.removeChild(hostElement);
        }

        // Detach and destroy Angular component
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      }, 300);
    }

    // Emit closed event
    this.dialogClosed$.next({ id: instance.id, result });
  }
}
