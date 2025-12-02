import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, ElementRef, Input, TemplateRef } from '@angular/core';
import { SqDialogCore } from '../../classes/sq-dialog-core.class';
import { SqClickOutsideDirective } from '../../directives/sq-click-outside/sq-click-outside.directive';
import { SqDataTestDirective } from '../../directives/sq-data-test/sq-data-test.directive';
import { OverlayDirectionType } from '../../interfaces/modal.interface';

/**
 * Overlay base component for displaying side panel dialogs.
 * Extends SqDialogCore for shared functionality.
 *
 * Can be used directly in templates or opened programmatically via SqModalService.
 *
 * @example
 * Direct usage in template:
 * ```html
 * <sq-overlay-base [open]="isOpen" direction="right" width="500px" (dialogClose)="onClose()">
 *   <ng-template #headerOverlay>
 *     <h2>Panel Title</h2>
 *   </ng-template>
 *   <p>Panel content goes here</p>
 *   <ng-template #footerOverlay>
 *     <button (click)="onClose()">Close</button>
 *   </ng-template>
 * </sq-overlay-base>
 * ```
 *
 * @example
 * Programmatic usage via service:
 * ```typescript
 * const ref = this.modalService.openOverlay({
 *   direction: 'right',
 *   width: '500px',
 *   body: MyContentComponent,
 *   data: { items: [...] }
 * });
 *
 * ref.afterClosed().subscribe(result => {
 *   console.log('Overlay closed with:', result);
 * });
 * ```
 */
@Component({
  selector: 'sq-overlay-base',
  templateUrl: './sq-overlay-base.component.html',
  styleUrls: ['./sq-overlay-base.component.scss'],
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, SqClickOutsideDirective, SqDataTestDirective],
})
export class SqOverlayBaseComponent extends SqDialogCore {
  /**
   * Unique style ID for dynamic CSS injection.
   */
  protected override styleId = `overlay-style-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  /**
   * Direction from which the overlay slides in.
   */
  @Input() direction: OverlayDirectionType = 'right';

  /**
   * Width of the overlay panel.
   */
  @Input() width = '475px';

  /**
   * Whether to hide borders in the overlay.
   */
  @Input() borderless = false;

  /**
   * Header template from content projection.
   */
  @ContentChild('headerOverlay') override headerTemplate?: TemplateRef<ElementRef>;

  /**
   * Footer template from content projection.
   */
  @ContentChild('footerOverlay') override footerTemplate?: TemplateRef<ElementRef>;

  /**
   * Whether the overlay has finished opening animation.
   */
  finishOpening = false;

  /**
   * Get CSS classes for the overlay container.
   *
   * @returns Object with CSS class names as keys and boolean values
   */
  override getDialogClasses(): Record<string, boolean> {
    return {
      modal: true,
      overlay: true,
      open: this.open,
      [this.direction]: true,
      [this.customClass]: !!this.customClass,
    };
  }

  /**
   * Get CSS classes for the modal-dialog element.
   *
   * @returns Object with CSS class names as keys and boolean values
   */
  override getModalDialogClasses(): Record<string, boolean> {
    return {
      'modal-dialog': true,
      [this.direction]: true,
      opened: this.finishOpening,
    };
  }

  /**
   * Hook called when the overlay opens.
   */
  protected override onDialogOpen(): void {
    // Update header/footer detection for content-projected templates
    this.hasHeader = this.showHeader;
    this.hasFooter = this.showFooter;

    // Inject dynamic width CSS
    this.injectWidthCss();

    // Set finish opening flag after a short delay for animation
    setTimeout(() => {
      this.finishOpening = true;
    }, 10);
  }

  /**
   * Hook called when the overlay closes.
   */
  protected override onDialogClose(): void {
    this.finishOpening = false;
    this.removeWidthCss();
  }

  /**
   * Inject dynamic CSS for overlay width.
   */
  private injectWidthCss(): void {
    const css = `
      .overlay.open .modal-dialog.opened {
        width: ${this.width};
      }
    `;
    const head = this.document.getElementsByTagName('head')[0];
    let style = this.document.getElementById(this.styleId);

    if (!style) {
      style = this.document.createElement('style');
      style.setAttribute('id', this.styleId);
      style.appendChild(this.document.createTextNode(css));
      head.appendChild(style);
    } else {
      style.innerHTML = '';
      style.appendChild(this.document.createTextNode(css));
    }
  }

  /**
   * Remove the dynamic CSS for overlay width.
   */
  private removeWidthCss(): void {
    const style = this.document.getElementById(this.styleId);
    if (style?.parentNode) {
      style.parentNode.removeChild(style);
    }
  }
}
