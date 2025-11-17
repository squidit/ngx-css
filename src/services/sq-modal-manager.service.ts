import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Type,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  SqModalConfig,
  SqModalInstance,
  SqModalRef,
  SqModalContentComponent,
} from '../interfaces/modal-config.interface';
import { SqModalBaseComponent } from '../components/sq-modal-base/sq-modal-base.component';

/**
 * Service to manage modal/overlay instances dynamically.
 * Creates SqModalBaseComponent as wrapper and injects content components inside.
 *
 * @example
 * // Inject the service
 * constructor(private modalManager: SqModalManagerService) {}
 *
 * // Open a modal with a component
 * openModal() {
 *   const modalRef = this.modalManager.open(MyComponent, {
 *     type: 'modal',
 *     size: 'lg',
 *     data: { title: 'Hello', count: 42 }
 *   });
 *
 *   modalRef.afterClosed().subscribe(result => {
 *     console.log('Modal closed with result:', result);
 *   });
 * }
 *
 * // Inside MyComponent, inject modalRef and close
 * @Input() modalRef?: SqModalRef;
 * close() { this.modalRef?.close({ success: true }); }
 */
@Injectable({
  providedIn: 'root',
})
export class SqModalManagerService {
  /**
   * Map of all currently open modal instances.
   */
  private modals = new Map<string, SqModalInstance<any, any>>();

  /**
   * Counter to generate unique modal IDs.
   */
  private modalCounter = 0;

  /**
   * Subject that emits when a modal is opened.
   */
  modalOpened$ = new Subject<{ id: string; config: SqModalConfig }>();

  /**
   * Subject that emits when a modal is closed.
   */
  modalClosed$ = new Subject<{ id: string; result?: any }>();

  /**
   * Environment injector for creating dynamic components.
   */
  private injector = inject(EnvironmentInjector);

  /**
   * Application reference for attaching components to the DOM.
   */
  private appRef = inject(ApplicationRef);

  /**
   * Open a modal with a dynamic component.
   *
   * @param contentComponent - The component to render inside the modal
   * @param config - Configuration options for the modal
   * @returns A reference to the opened modal
   */
  open<T extends object, R = any>(contentComponent: Type<T>, config: SqModalConfig<T> = {}): SqModalRef<T, R> {
    const modalId = `sq-modal-managed-${++this.modalCounter}`;
    const normalizedConfig = this.normalizeConfig(config);

    // Create the modal instance
    const instance: SqModalInstance<T, R> = {
      id: modalId,
      component: contentComponent,
      config: normalizedConfig,
      data: config.data,
      resultSubject: new Subject<R | undefined>(),
    };

    // Store the instance early so modalRef can reference it
    this.modals.set(modalId, instance);

    // Create the modal reference BEFORE creating the component
    const modalRef = this.createModalRef<T, R>(instance);

    // Create and attach the SqModalBaseComponent wrapper with the content inside
    this.createModalWithContent(instance, modalRef);

    // Emit opened event
    this.modalOpened$.next({ id: modalId, config: instance.config });

    // Return the modal reference
    return modalRef;
  }

  /**
   * Close a specific modal by ID.
   * This is called programmatically from modalRef.close()
   */
  close(modalId: string, result?: any): void {
    const instance = this.modals.get(modalId);
    if (!instance) {
      return;
    }

    // Prevent duplicate close operations
    if (instance.isClosing) {
      return;
    }
    instance.isClosing = true;

    const body = document.getElementsByTagName('body')[0];
    body?.classList?.remove('block');

    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
      backdrop.parentNode?.removeChild(backdrop);
    }

    // Close the modal component visually
    if (instance.componentRef) {
      const baseComponent = instance.componentRef.instance as SqModalBaseComponent;

      if (baseComponent && typeof baseComponent.closeModal === 'function') {
        baseComponent.closeModal();
      }
    }

    // Emit result (or undefined if no result)
    instance.resultSubject.next(result);
    instance.resultSubject.complete();

    // Cleanup after animation
    setTimeout(() => {
      if (this.modals.has(modalId) && instance.componentRef) {
        this.appRef.detachView(instance.componentRef.hostView);
        instance.componentRef.destroy();
      }
      this.modals.delete(modalId);
      this.modalClosed$.next({ id: modalId, result });
    }, 100);
  }

  /**
   * Close all open modals.
   */
  closeAll(): void {
    const modalIds = Array.from(this.modals.keys());
    modalIds.forEach(id => this.close(id));
  }

  /**
   * Get the number of open modals.
   */
  get openModalsCount(): number {
    return this.modals.size;
  }

  /**
   * Check if a specific modal is open.
   */
  isOpen(modalId: string): boolean {
    return this.modals.has(modalId);
  }

  /**
   * Update data in a specific modal's content component.
   */
  updateData<T extends object>(modalId: string, data: Partial<T>): void {
    const instance = this.modals.get(modalId);
    if (!instance || !instance.contentComponentRef) {
      return;
    }

    // Update the content component's inputs
    Object.keys(data).forEach(key => {
      if (key in instance.contentComponentRef!.instance) {
        (instance.contentComponentRef!.instance as any)[key] = (data as any)[key];
      }
    });

    instance.contentComponentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Create SqModalBaseComponent and inject content component inside.
   */
  private createModalWithContent<T extends object, R = any>(
    instance: SqModalInstance<T, R>,
    modalRef: SqModalRef<T, R>
  ): void {
    // Step 1: Create SqModalBaseComponent
    const baseComponentRef = createComponent(SqModalBaseComponent, {
      environmentInjector: this.injector,
    });

    // Step 2: Configure SqModalBaseComponent inputs (but don't open yet)
    const baseInstance = baseComponentRef.instance;
    baseInstance.id = instance.id;
    baseInstance.type = instance.config.type || 'modal';
    baseInstance.size = instance.config.size || 'md';
    baseInstance.direction = instance.config.direction || 'right';
    baseInstance.width = instance.config.width || '475px';
    baseInstance.backdrop = instance.config.backdrop || 'static';
    baseInstance.showCloseButton = instance.config.showCloseButton !== false;
    baseInstance.customClass = instance.config.customClass || '';
    baseInstance.backdropClass = instance.config.backdropClass || '';
    baseInstance.headerPadding = instance.config.headerPadding || '';
    baseInstance.bodyPadding = instance.config.bodyPadding || '';
    baseInstance.footerPadding = instance.config.footerPadding || '';
    baseInstance.headerBgColor = instance.config.headerBgColor || '';
    baseInstance.bodyBgColor = instance.config.bodyBgColor || '';
    baseInstance.footerBgColor = instance.config.footerBgColor || '';
    baseInstance.borderless = instance.config.borderless || false;
    baseInstance.headerItemsColor = instance.config.headerItemsColor || '';
    baseInstance.dataTest = instance.config.dataTest || 'sq-modal-base';
    baseInstance.managedByService = true;
    baseInstance.open = false;

    baseInstance.modalRef = modalRef;

    // Pass title and button texts
    baseInstance.title = instance.config.title;
    baseInstance.cancelButtonText = instance.config.cancelButtonText || 'Fechar';
    baseInstance.confirmButtonText = instance.config.confirmButtonText || 'Concluir';
    baseInstance.showFooterButtons = instance.config.showFooterButtons !== false;

    // Pass header and footer templates if provided
    if (instance.config.headerTemplate) {
      baseInstance.headerTemplateInput = instance.config.headerTemplate;
    }
    if (instance.config.footerTemplate) {
      baseInstance.footerTemplateInput = instance.config.footerTemplate;
    }

    // Step 3: Subscribe to modalClose event
    // Emitted when user clicks X, presses ESC, or clicks outside (if backdrop='true')
    baseInstance.modalClose.subscribe(() => {
      if (this.modals.has(instance.id)) {
        const modalInstance = this.modals.get(instance.id)!;

        // Prevent duplicate cleanup
        if (modalInstance.isClosing) {
          return;
        }

        // Just call close() which handles everything
        this.close(instance.id);
      }
    });

    // Store the base component ref
    instance.componentRef = baseComponentRef;

    // Attach to Angular and DOM (but hidden initially)
    this.appRef.attachView(baseComponentRef.hostView);
    const baseRootNodes = (baseComponentRef.hostView as any).rootNodes;
    const baseDomElem = baseRootNodes?.find((node: any) => node.nodeType === 1);

    if (baseDomElem) {
      // Anexar ao DOM mas escondido (display: none)
      baseDomElem.style.display = 'none';
      document.body.appendChild(baseDomElem);
    }

    // Trigger initial change detection
    baseComponentRef.changeDetectorRef.detectChanges();

    requestAnimationFrame(() => {
      this.injectContentComponent(instance, baseComponentRef);

      requestAnimationFrame(async () => {
        await baseInstance.openModal();
      });
    });
  }

  /**
   * Inject the content component into the SqModalBaseComponent's dynamicContentContainer.
   */
  private injectContentComponent<T extends object>(
    instance: SqModalInstance<T, any>,
    baseComponentRef: ComponentRef<SqModalBaseComponent>
  ): void {
    const baseInstance = baseComponentRef.instance;
    const container = baseInstance.dynamicContentContainer;

    if (!container || !instance.component) {
      return;
    }

    const contentComponentRef = container.createComponent(instance.component, {
      environmentInjector: this.injector,
    });

    instance.contentComponentRef = contentComponentRef;

    // Set inputs from data
    if (instance.data) {
      Object.keys(instance.data).forEach(key => {
        if (key in contentComponentRef.instance) {
          (contentComponentRef.instance as any)[key] = (instance.data as any)[key];
        }
      });
    }

    // Pass the modalRef to the content component if it has that input
    const modalRef = this.createModalRef<T, any>(instance);
    if ('modalRef' in contentComponentRef.instance) {
      (contentComponentRef.instance as any).modalRef = modalRef;
    }

    // Check if content component has custom templates
    const contentInstance = contentComponentRef.instance as Partial<SqModalContentComponent>;

    if (contentInstance.customHeaderTemplate) {
      baseInstance.headerTemplateInput = contentInstance.customHeaderTemplate;
    }

    if (contentInstance.customFooterTemplate) {
      baseInstance.footerTemplateInput = contentInstance.customFooterTemplate;
    }

    contentComponentRef.changeDetectorRef.detectChanges();
    baseComponentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Create a modal reference object.
   */
  private createModalRef<T extends object, R>(instance: SqModalInstance<T, R>): SqModalRef<T, R> {
    return {
      id: instance.id,
      close: (result?: R) => this.close(instance.id, result),
      updateData: (data: Partial<T>) => this.updateData<T>(instance.id, data),
      afterClosed: () => instance.resultSubject.asObservable(),
    };
  }

  /**
   * Normalize configuration with defaults.
   */
  private normalizeConfig<T extends object>(config: SqModalConfig<T>): SqModalConfig<T> {
    return {
      type: config.type || 'modal',
      size: config.size || 'md',
      direction: config.direction || 'right',
      width: config.width || '475px',
      backdrop: config.backdrop || 'static',
      showCloseButton: config.showCloseButton !== false,
      customClass: config.customClass || '',
      backdropClass: config.backdropClass || '',
      headerPadding: config.headerPadding || '',
      bodyPadding: config.bodyPadding || (config.type === 'overlay' ? '2rem' : '0 1rem'),
      footerPadding: config.footerPadding || '',
      headerBgColor: config.headerBgColor || '',
      bodyBgColor: config.bodyBgColor || '',
      footerBgColor: config.footerBgColor || '',
      borderless: config.borderless || false,
      headerItemsColor: config.headerItemsColor || '',
      data: config.data,
      dataTest: config.dataTest || 'sq-modal-base',
      title: config.title,
      headerTemplate: config.headerTemplate,
      footerTemplate: config.footerTemplate,
      cancelButtonText: config.cancelButtonText || 'Fechar',
      confirmButtonText: config.confirmButtonText || 'Concluir',
      showFooterButtons: config.showFooterButtons !== false,
    };
  }
}
