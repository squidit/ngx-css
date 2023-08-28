import { Injectable } from '@angular/core'

interface Toast {
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

interface ToastResponse {
  message: string
  config: ToastConfig
}

interface ToastConfig {
  position?: string
  className?: string,
  fadeDuration?: number,
  fadeInterval?: number,
  duration?: number,
  closeButton?: boolean,
  immediately?: boolean,
  notOverClick?: boolean,
  onClick?: () => void,
  persistent?: boolean,
}

declare const Toast: Toast

@Injectable({
  providedIn: 'root',
})
export class ToastHelper {
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

  constructor() {
    this.toast = Toast
  }

  toastLogSrr(message: string, config: ToastConfig) {
    return {
      message,
      config,
    }
  }
}
