import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * A utility service for working with the window object in Angular applications.
 *
 * This service provides methods to retrieve the window object, the href location object, and touch capabilities.
 *
 * @example
 * Inject the GetWindow service and use its methods:
 * constructor(private getWindow: GetWindow) { }
 *
 * Or instance a new class
 * const getWindow = new GetWindow()
 *
 * const window = this.getWindow.window();
 * const href = this.getWindow.href();
 * const touch = this.getWindow.touch();]
 * @returns {void}
 */
@Injectable({
  providedIn: 'root',
})
export class GetWindow {
  /**
   * The injected DOCUMENT to get a reference to the window object in a way that's safe for SSR.
   */
  private document = inject(DOCUMENT);

  /**
   * Allow to get the window object inside ssr
   * @returns {Window | null} - The window object.
   */
  window(): (Window & typeof globalThis) | null {
    return this.document.defaultView;
  }

  /**
   * Allow to get the href location object inside ssr
   * @returns {string | URL} - The href location object.
   */
  href(): string | URL {
    const window = this.window();
    if (window) {
      return window.location.href;
    }
    return '';
  }

  /**
   * Allow to get the origin location object inside ssr
   * @returns {boolean} - `true` if the browser supports touch events, otherwise `false`.
   */
  touch(): boolean {
    const window = this.window();
    if (window) {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    return false;
  }
}
