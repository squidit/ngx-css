import { TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Type of toast notification.
 */
export type SqToastType = 'success' | 'error' | 'warning' | 'info' | 'default';

/**
 * Position of the toast container on screen.
 */
export type SqToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'top-full'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-full';

/**
 * Reason why a toast was dismissed.
 */
export type SqToastDismissReason = 'timeout' | 'action' | 'manual' | 'swipe';

/**
 * Action button configuration for toast.
 */
export interface SqToastAction {
  /**
   * Label text for the action button.
   */
  label: string;

  /**
   * Callback function when action is clicked.
   * If not provided, clicking the action will just dismiss the toast.
   */
  callback?: () => void;
}

/**
 * Configuration options for displaying a toast notification.
 */
export interface SqToastConfig {
  /**
   * Type of toast (affects styling).
   *
   * @default 'default'
   */
  type?: SqToastType;

  /**
   * Duration in milliseconds before auto-dismiss.
   * Set to 0 for persistent toast (manual dismiss only).
   *
   * @default 5000
   */
  duration?: number;

  /**
   * Position of the toast on screen.
   *
   * @default 'top-right'
   */
  position?: SqToastPosition;

  /**
   * Whether the toast can be closed manually via close button.
   * When duration is 0 (persistent), this is automatically set to true.
   *
   * @default false
   */
  closeable?: boolean;

  /**
   * Optional action button configuration.
   */
  action?: SqToastAction;

  /**
   * Custom icon class (Font Awesome).
   * If not provided, uses default icon based on type.
   */
  icon?: string;

  /**
   * Whether to show the icon.
   *
   * @default true
   */
  showIcon?: boolean;

  /**
   * Custom CSS class to apply to the toast.
   */
  customClass?: string;

  /**
   * Data-test attribute for testing purposes.
   */
  dataTest?: string;

  /**
   * Whether clicking the toast dismisses it.
   *
   * @default false
   */
  dismissOnClick?: boolean;

  /**
   * Whether to pause the timer on hover.
   *
   * @default true
   */
  pauseOnHover?: boolean;

  /**
   * Data to pass to the template context when message is a TemplateRef.
   * Available in template as `let-data="data"`.
   */
  data?: any;
}

/**
 * Reference to an active toast instance.
 * Allows programmatic control and observation of toast lifecycle.
 *
 * @example
 * ```typescript
 * const toastRef = this.toastService.success('Item saved!');
 *
 * // Dismiss programmatically
 * toastRef.dismiss();
 *
 * // Listen for dismissal
 * toastRef.afterDismissed().subscribe(reason => {
 *   console.log('Toast dismissed:', reason);
 * });
 * ```
 */
export class SqToastRef {
  /**
   * Unique identifier for this toast instance.
   */
  readonly id: string;

  /**
   * Subject for emitting dismiss events.
   */
  private dismissSubject = new Subject<SqToastDismissReason>();

  /**
   * Subject for triggering manual dismiss.
   */
  private manualDismissSubject = new Subject<void>();

  /**
   * Creates a new toast reference.
   *
   * @param id - Unique identifier for the toast
   */
  constructor(id: string) {
    this.id = id;
  }

  /**
   * Observable that emits when the toast is dismissed.
   *
   * @returns Observable with the dismiss reason
   */
  afterDismissed(): Observable<SqToastDismissReason> {
    return this.dismissSubject.asObservable();
  }

  /**
   * Observable for listening to manual dismiss requests.
   * Used internally by the toast component.
   *
   * @returns Observable that emits when dismiss is requested
   */
  onDismissRequest(): Observable<void> {
    return this.manualDismissSubject.asObservable();
  }

  /**
   * Programmatically dismiss the toast.
   */
  dismiss(): void {
    this.manualDismissSubject.next();
  }

  /**
   * Mark the toast as dismissed with a reason.
   * Used internally by the toast service.
   *
   * @param reason - Why the toast was dismissed
   */
  markDismissed(reason: SqToastDismissReason): void {
    this.dismissSubject.next(reason);
    this.dismissSubject.complete();
    this.manualDismissSubject.complete();
  }
}

/**
 * Message content for a toast - can be a string or a TemplateRef.
 */
export type SqToastMessage = string | TemplateRef<any>;

/**
 * Internal interface for tracking active toasts.
 */
export interface SqToastInstance {
  /**
   * Unique identifier.
   */
  id: string;

  /**
   * Toast message content (string or TemplateRef).
   */
  message: SqToastMessage;

  /**
   * Whether the message is a TemplateRef.
   */
  isTemplate: boolean;

  /**
   * Toast configuration (with closeable computed).
   */
  config: Required<Omit<SqToastConfig, 'action' | 'closeable' | 'data'>> & {
    action?: SqToastAction;
    closeable: boolean;
    data?: any;
  };

  /**
   * Reference for external control.
   */
  ref: SqToastRef;

  /**
   * Timestamp when toast was created.
   */
  createdAt: number;
}

/**
 * Default toast configuration values.
 */
export const SQ_TOAST_DEFAULTS: Required<Omit<SqToastConfig, 'action' | 'customClass' | 'dataTest' | 'icon' | 'data'>> =
  {
    type: 'default',
    duration: 5000,
    position: 'top-right',
    closeable: true, // Show close button by default
    showIcon: false, // Match legacy behavior - no icon by default
    dismissOnClick: false,
    pauseOnHover: true,
  };

/**
 * Default icons for each toast type.
 */
export const SQ_TOAST_ICONS: Record<SqToastType, string> = {
  success: 'fa-solid fa-check-circle',
  error: 'fa-solid fa-times-circle',
  warning: 'fa-solid fa-exclamation-triangle',
  info: 'fa-solid fa-info-circle',
  default: 'fa-solid fa-bell',
};
