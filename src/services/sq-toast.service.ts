import {
  Injectable,
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  TemplateRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SqToastContainerComponent } from '../components/sq-toast/sq-toast-container.component';
import {
  SqToastConfig,
  SqToastRef,
  SqToastInstance,
  SqToastDismissReason,
  SqToastMessage,
  SqToastPosition,
  SQ_TOAST_DEFAULTS,
} from '../interfaces/sq-toast.interface';

/**
 * Internal interface for container tracking.
 * Used to manage toast containers for different positions.
 * @internal
 */
interface ContainerEntry {
  /**
   * Reference to the dynamically created container component.
   */
  ref: ReturnType<typeof createComponent<SqToastContainerComponent>>;

  /**
   * Number of active toasts in this container.
   * Used to determine when to destroy the container.
   */
  toastCount: number;
}

/**
 * Service for displaying toast notifications.
 *
 * Provides a simple API for showing different types of toast messages
 * with full customization support and Observable-based lifecycle events.
 *
 * Each position has its own container, so toasts in different positions
 * don't interfere with each other.
 *
 * @example
 * ```typescript
 * // Simple usage
 * this.toastService.success('Operation completed!');
 *
 * // With configuration
 * this.toastService.error('Something went wrong', {
 *   duration: 10000,
 *   action: {
 *     label: 'Retry',
 *     callback: () => this.retry()
 *   }
 * });
 *
 * // With Observable
 * this.toastService.warning('Are you sure?', { duration: 0 })
 *   .afterDismissed()
 *   .subscribe(reason => console.log('Dismissed:', reason));
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SqToastService {
  /**
   * Reference to the document.
   */
  private document = inject(DOCUMENT);

  /**
   * Angular application reference.
   */
  private appRef = inject(ApplicationRef);

  /**
   * Environment injector for creating components.
   */
  private injector = inject(EnvironmentInjector);

  /**
   * Map of containers by position.
   * Each position has its own container to avoid position changes affecting existing toasts.
   */
  private containers = new Map<SqToastPosition, ContainerEntry>();

  /**
   * Map of active toasts by ID, including their position.
   */
  private activeToasts = new Map<string, { toast: SqToastInstance; position: SqToastPosition }>();

  /**
   * Counter for generating unique IDs.
   */
  private idCounter = 0;

  /**
   * Show a success toast.
   *
   * @param message - Message to display (string or TemplateRef)
   * @param config - Optional configuration
   * @returns Reference to the toast
   */
  success(message: SqToastMessage, config?: Omit<SqToastConfig, 'type'>): SqToastRef {
    return this.show(message, { ...config, type: 'success' });
  }

  /**
   * Show an error toast.
   *
   * @param message - Message to display (string or TemplateRef)
   * @param config - Optional configuration
   * @returns Reference to the toast
   */
  error(message: SqToastMessage, config?: Omit<SqToastConfig, 'type'>): SqToastRef {
    return this.show(message, { ...config, type: 'error' });
  }

  /**
   * Show a warning toast.
   *
   * @param message - Message to display (string or TemplateRef)
   * @param config - Optional configuration
   * @returns Reference to the toast
   */
  warning(message: SqToastMessage, config?: Omit<SqToastConfig, 'type'>): SqToastRef {
    return this.show(message, { ...config, type: 'warning' });
  }

  /**
   * Show an info toast.
   *
   * @param message - Message to display (string or TemplateRef)
   * @param config - Optional configuration
   * @returns Reference to the toast
   */
  info(message: SqToastMessage, config?: Omit<SqToastConfig, 'type'>): SqToastRef {
    return this.show(message, { ...config, type: 'info' });
  }

  /**
   * Show a default toast.
   *
   * @param message - Message to display (string or TemplateRef)
   * @param config - Optional configuration
   * @returns Reference to the toast
   */
  default(message: SqToastMessage, config?: Omit<SqToastConfig, 'type'>): SqToastRef {
    return this.show(message, { ...config, type: 'default' });
  }

  /**
   * Show a toast with full configuration.
   *
   * @param message - Message to display (string or TemplateRef)
   * @param config - Toast configuration
   * @returns Reference to the toast
   */
  show(message: SqToastMessage, config?: SqToastConfig): SqToastRef {
    // Merge config with defaults
    const mergedConfig = {
      ...SQ_TOAST_DEFAULTS,
      ...config,
    };

    // Get the position for this toast
    const position = mergedConfig.position;

    // Ensure container exists for this position
    const container = this.ensureContainer(position);

    // Generate unique ID
    const id = this.generateId();

    // Create toast ref
    const ref = new SqToastRef(id);

    // If duration is 0 (persistent), force closeable to true
    // The toast needs a way to be closed manually
    if (mergedConfig.duration === 0) {
      mergedConfig.closeable = true;
    }

    // Determine if message is a template
    const isTemplate = message instanceof TemplateRef;

    // Create toast instance
    const toast: SqToastInstance = {
      id,
      message,
      isTemplate,
      config: mergedConfig as SqToastInstance['config'],
      ref,
      createdAt: Date.now(),
    };

    // Track toast with its position
    this.activeToasts.set(id, { toast, position });

    // Increment container toast count
    container.toastCount++;

    // Add to container
    container.ref.instance.addToast(toast);

    return ref;
  }

  /**
   * Dismiss all active toasts.
   */
  dismissAll(): void {
    this.activeToasts.forEach(({ toast }) => {
      toast.ref.dismiss();
    });
  }

  /**
   * Get the number of active toasts.
   *
   * @returns Number of active toasts
   */
  getActiveCount(): number {
    return this.activeToasts.size;
  }

  /**
   * Ensure the toast container exists for a specific position.
   *
   * @param position - Position for the container
   * @returns Container entry for the position
   */
  private ensureContainer(position: SqToastPosition): ContainerEntry {
    let entry = this.containers.get(position);

    if (entry) {
      return entry;
    }

    // Create container component
    const containerRef = createComponent(SqToastContainerComponent, {
      environmentInjector: this.injector,
    });

    // Set position
    containerRef.instance.position = position;

    // Set up dismiss callback
    containerRef.instance.setDismissCallback((id, reason) => {
      this.handleDismiss(id, reason);
    });

    // Attach to application
    this.appRef.attachView(containerRef.hostView);

    // Append to body
    const hostElement = containerRef.location.nativeElement;
    this.document.body.appendChild(hostElement);

    // Create entry
    entry = { ref: containerRef, toastCount: 0 };
    this.containers.set(position, entry);

    return entry;
  }

  /**
   * Handle toast dismissal.
   *
   * @param id - Toast ID
   * @param reason - Dismiss reason
   */
  private handleDismiss(id: string, reason: SqToastDismissReason): void {
    const entry = this.activeToasts.get(id);

    if (!entry) {
      return;
    }

    const { toast, position } = entry;

    // Mark toast as dismissed
    toast.ref.markDismissed(reason);
    this.activeToasts.delete(id);

    // Decrement container toast count
    const container = this.containers.get(position);
    if (container) {
      container.toastCount--;

      // Clean up container if no more toasts in this position
      if (container.toastCount === 0) {
        this.destroyContainer(position);
      }
    }
  }

  /**
   * Destroy the toast container for a specific position.
   *
   * @param position - Position of the container to destroy
   */
  private destroyContainer(position: SqToastPosition): void {
    const entry = this.containers.get(position);

    if (!entry) {
      return;
    }

    const hostElement = entry.ref.location.nativeElement;

    this.appRef.detachView(entry.ref.hostView);
    entry.ref.destroy();

    if (hostElement.parentNode) {
      hostElement.parentNode.removeChild(hostElement);
    }

    this.containers.delete(position);
  }

  /**
   * Generate a unique toast ID.
   *
   * @returns Unique ID string
   */
  private generateId(): string {
    return `sq-toast-${++this.idCounter}-${Date.now()}`;
  }
}
