import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, HostBinding } from '@angular/core';
import { NgClass } from '@angular/common';
import { SqToastComponent } from './sq-toast.component';
import { SqToastInstance, SqToastDismissReason, SqToastPosition } from '../../interfaces/sq-toast.interface';

/**
 * Container component for displaying toast notifications.
 * Manages the positioning and stacking of multiple toasts.
 *
 * This component is created dynamically by SqToastService and should not
 * be used directly in templates.
 */
@Component({
  selector: 'sq-toast-container',
  template: `
    @for (toast of toasts; track toast.id) {
      <sq-toast [toast]="toast" (dismissed)="onToastDismissed(toast, $event)"></sq-toast>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem;
        max-height: 100vh;
        overflow: hidden;
        /* Default position: top-right */
        top: 0;
        right: 0;
        bottom: auto;
        left: auto;
        transform: none;
        align-items: flex-end;
      }

      /* Positioning classes */
      :host.top-right {
        top: 0;
        right: 0;
        bottom: auto;
        left: auto;
        transform: none;
        flex-direction: column;
        align-items: flex-end;
      }

      :host.top-left {
        top: 0;
        left: 0;
        bottom: auto;
        right: auto;
        transform: none;
        flex-direction: column;
        align-items: flex-start;
      }

      :host.top-center {
        top: 0;
        left: 50%;
        bottom: auto;
        right: auto;
        transform: translateX(-50%);
        flex-direction: column;
        align-items: center;
      }

      :host.bottom-right {
        bottom: 0;
        right: 0;
        top: auto;
        left: auto;
        transform: none;
        flex-direction: column-reverse;
        align-items: flex-end;
      }

      :host.bottom-left {
        bottom: 0;
        left: 0;
        top: auto;
        right: auto;
        transform: none;
        flex-direction: column-reverse;
        align-items: flex-start;
      }

      :host.bottom-center {
        bottom: 0;
        left: 50%;
        top: auto;
        right: auto;
        transform: translateX(-50%);
        flex-direction: column-reverse;
        align-items: center;
      }

      :host.top-full {
        top: 0;
        left: 0;
        right: 0;
        bottom: auto;
        transform: none;
        flex-direction: column;
        align-items: stretch;
        padding: 0;
        gap: 0;
      }

      :host.bottom-full {
        bottom: 0;
        left: 0;
        right: 0;
        top: auto;
        transform: none;
        flex-direction: column-reverse;
        align-items: stretch;
        padding: 0;
        gap: 0;
      }
    `,
  ],
  standalone: true,
  imports: [NgClass, SqToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SqToastContainerComponent {
  /**
   * Current position of the toast container.
   */
  position: SqToastPosition = 'top-right';

  /**
   * Array of active toasts.
   */
  toasts: SqToastInstance[] = [];

  /**
   * Change detector reference.
   */
  private cdr = inject(ChangeDetectorRef);

  /**
   * Callback for when a toast is dismissed.
   */
  private dismissCallback?: (id: string, reason: SqToastDismissReason) => void;

  // ============================================
  // Host Bindings
  // ============================================

  /**
   * Base class for the container.
   */
  @HostBinding('class.toast-container') readonly hostClass = true;

  /**
   * Data-test attribute for testing.
   */
  @HostBinding('attr.data-test') readonly dataTest = 'sq-toast-container';

  /**
   * Position class: top-right.
   */
  @HostBinding('class.top-right') get isTopRight(): boolean {
    return this.position === 'top-right';
  }

  /**
   * Position class: top-left.
   */
  @HostBinding('class.top-left') get isTopLeft(): boolean {
    return this.position === 'top-left';
  }

  /**
   * Position class: top-center.
   */
  @HostBinding('class.top-center') get isTopCenter(): boolean {
    return this.position === 'top-center';
  }

  /**
   * Position class: top-full.
   */
  @HostBinding('class.top-full') get isTopFull(): boolean {
    return this.position === 'top-full';
  }

  /**
   * Position class: bottom-right.
   */
  @HostBinding('class.bottom-right') get isBottomRight(): boolean {
    return this.position === 'bottom-right';
  }

  /**
   * Position class: bottom-left.
   */
  @HostBinding('class.bottom-left') get isBottomLeft(): boolean {
    return this.position === 'bottom-left';
  }

  /**
   * Position class: bottom-center.
   */
  @HostBinding('class.bottom-center') get isBottomCenter(): boolean {
    return this.position === 'bottom-center';
  }

  /**
   * Position class: bottom-full.
   */
  @HostBinding('class.bottom-full') get isBottomFull(): boolean {
    return this.position === 'bottom-full';
  }

  // ============================================
  // Public Methods
  // ============================================

  /**
   * Add a toast to the container.
   * Note: Position is set by the service when creating the container,
   * so toasts added here will use the container's fixed position.
   *
   * @param toast - Toast instance to add
   */
  addToast(toast: SqToastInstance): void {
    this.toasts.push(toast);
    this.cdr.markForCheck();
  }

  /**
   * Remove a toast from the container.
   *
   * @param id - ID of the toast to remove
   */
  removeToast(id: string): void {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      this.toasts.splice(index, 1);
      this.cdr.markForCheck();
    }
  }

  /**
   * Set the callback for toast dismissal.
   *
   * @param callback - Function to call when a toast is dismissed
   */
  setDismissCallback(callback: (id: string, reason: SqToastDismissReason) => void): void {
    this.dismissCallback = callback;
  }

  /**
   * Handle toast dismissed event.
   *
   * @param toast - The dismissed toast
   * @param reason - Why it was dismissed
   */
  onToastDismissed(toast: SqToastInstance, reason: SqToastDismissReason): void {
    this.removeToast(toast.id);

    if (this.dismissCallback) {
      this.dismissCallback(toast.id, reason);
    }
  }

  /**
   * Check if container has any toasts.
   *
   * @returns True if there are active toasts
   */
  hasToasts(): boolean {
    return this.toasts.length > 0;
  }
}
