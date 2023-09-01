import { Injectable } from '@angular/core'

/**
 * Represents Toast Instance.
 */
export interface Toast {
  success: (message: string, config: ToastConfig) => ToastResponse
  error: (message: string, config: ToastConfig) => ToastResponse
  inverted: (message: string, config: ToastConfig) => ToastResponse
  info: (message: string, config: ToastConfig) => ToastResponse
  warning: (message: string, config: ToastConfig) => ToastResponse
  grayscale: (message: string, config: ToastConfig) => ToastResponse
  custom: (message: string, config: ToastConfig) => ToastResponse
  default: (message: string, config: ToastConfig) => ToastResponse
  show: (message: string, config: ToastConfig) => ToastResponse
  theme: (message: string, config: ToastConfig) => ToastResponse
}

/**
 * Globel declare to get from window
 */
declare const Toast: Toast

/**
 * Represents a response from a toast message.
 */
export interface ToastResponse {
  message: string; // The message content of the toast.
  config: ToastConfig; // The configuration options used for the toast.
}

/**
 * Configuration options for a toast message.
 */
export interface ToastConfig {
  position?: string; // The position of the toast message on the screen.
  className?: string; // Custom CSS class to be applied to the toast.
  fadeDuration?: number; // Duration of the fade-in and fade-out animations.
  fadeInterval?: number; // Interval between consecutive fade animations.
  duration?: number; // Duration for which the toast is displayed.
  closeButton?: boolean; // Indicates whether a close button should be displayed.
  immediately?: boolean; // Indicates whether the toast should be displayed immediately without queuing.
  notOverClick?: boolean; // Prevents the toast from being displayed over a click event.
  onClick?: () => void; // A callback function to be executed when the toast is clicked.
  persistent?: boolean; // Indicates whether the toast should be persistent until manually closed.
}

/**
 * A service for displaying toast messages in Angular applications.
 *
 * Toast messages are often used to provide feedback to users in a non-intrusive way. This service
 * provides methods to display different types of toast messages with various configurations.
 *
 * @example
 * // Import and inject the ToastHelper service in a component or service.
 * import { Component } from '@angular/core';
 * import { ToastHelper } from './toast-helper.service';
 *
 * @Component({
 *   selector: 'app-root',
 *   template: '<button (click)="showToast()">Show Toast</button>',
 * })
 * export class AppComponent {
 *   constructor(private toastHelper: ToastHelper) {}
 *
 *   showToast() {
 *     // Display a success toast message.
 *     this.toastHelper.toast.success('Operation was successful.', { duration: 3000 });
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
    success: (message: string, config: ToastConfig) => this.toastLogSrr(message, config),
    error: (message: string, config: ToastConfig) => this.toastLogSrr(message, config),
    inverted: (message: string, config: ToastConfig) => this.toastLogSrr(message, config),
    info: (message: string, config: ToastConfig) => this.toastLogSrr(message, config),
    warning: (message: string, config: ToastConfig) => this.toastLogSrr(message, config),
    grayscale: (message: string, config: ToastConfig) => this.toastLogSrr(message, config),
    custom: (message: string, config: ToastConfig) => this.toastLogSrr(message, config),
    default: (message: string, config: ToastConfig) => this.toastLogSrr(message, config),
    show: (message: string, config: ToastConfig) => this.toastLogSrr(message, config),
    theme: (message: string, config: ToastConfig) => this.toastLogSrr(message, config),
  }

  /**
   * Creates an instance of the ToastHelper service.
   */
  constructor() {
    this.toast = Toast || window['Toast' as any] as unknown as Toast
  }

  /**
   * Logs and returns a toast message with the provided message and configuration.
   * @param {string} message - The message content of the toast.
   * @param {ToastConfig} config - The configuration options for the toast.
   * @returns {ToastResponse} - The response containing the message and configuration.
   */
  toastLogSrr(message: string, config: ToastConfig): ToastResponse {
    return {
      message,
      config,
    }
  }
}