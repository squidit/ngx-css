import { Injectable } from '@angular/core';
import { Toast, ToastConfig, ToastResponse } from '../interfaces/toast.interface';

/**
 * Global declare to get from window
 */
declare const Toast: Toast;

/**
 * A service for displaying toast messages in Angular applications.
 *
 * Toast messages are often used to provide feedback to users in a non-intrusive way. This service
 * provides methods to display different types of toast messages with various configurations.
 *
 * Look the link about the component in original framework and the appearance
 *
 * @see {@link https://css.squidit.com.br/components/toast}
 *
 * @example
 * @Component({
 *   selector: 'app-root',
 *   template: '<button (click)="showToast()">Show Toast</button>',
 * })
 * export class AppComponent {
 *   constructor(private toastHelper: ToastHelper) {}
 *
 *   showToast() {
 *     // Display a success toast message.
 *     this.toastHelper.toast.success('Operation was successful.', { duration: 3000 })
 *   }
 * }
 */
@Injectable({
  providedIn: 'root',
})
export class ToastHelper {
  /**
   * An object containing methods for displaying different types of toast messages.
   */
  public toast: Toast = {
    success: (message: string, config?: ToastConfig) => this.toastLogSrr(message, config),
    error: (message: string, config?: ToastConfig) => this.toastLogSrr(message, config),
    inverted: (message: string, config?: ToastConfig) => this.toastLogSrr(message, config),
    info: (message: string, config?: ToastConfig) => this.toastLogSrr(message, config),
    warning: (message: string, config?: ToastConfig) => this.toastLogSrr(message, config),
    grayscale: (message: string, config?: ToastConfig) => this.toastLogSrr(message, config),
    custom: (message: string, config?: ToastConfig) => this.toastLogSrr(message, config),
    default: (message: string, config?: ToastConfig) => this.toastLogSrr(message, config),
    show: (message: string, config?: ToastConfig) => this.toastLogSrr(message, config),
    theme: (message: string, config?: ToastConfig) => this.toastLogSrr(message, config),
  };

  /**
   * Creates an instance of the ToastHelper service.
   */
  constructor() {
    // Check if Toast is available globally (from @squidit/css)
    if (typeof window !== 'undefined' && window['Toast' as any]) {
      this.toast = window['Toast' as any] as unknown as Toast;
    }
    // Otherwise, use the fallback implementation (toastLogSrr)
  }

  /**
   * Logs and returns a toast message with the provided message and configuration.
   * @param {string} message - The message content of the toast.
   * @param {ToastConfig} config - The configuration options for the toast.
   * @returns {ToastResponse} - The response containing the message and configuration.
   */
  toastLogSrr(message: string, config?: ToastConfig): ToastResponse {
    return {
      message,
      config,
    };
  }
}
