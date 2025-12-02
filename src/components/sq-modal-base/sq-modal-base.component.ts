import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, ElementRef, Input, TemplateRef } from '@angular/core';
import { SqDialogCore } from '../../classes/sq-dialog-core.class';
import { SqClickOutsideDirective } from '../../directives/sq-click-outside/sq-click-outside.directive';
import { SqDataTestDirective } from '../../directives/sq-data-test/sq-data-test.directive';
import { ModalSizeType } from '../../interfaces/modal.interface';

/**
 * Modal base component for displaying centered dialog windows.
 * Extends SqDialogCore for shared functionality.
 *
 * Can be used directly in templates or opened programmatically via SqModalService.
 *
 * @example
 * Direct usage in template:
 * ```html
 * <sq-modal-base [open]="isOpen" size="lg" (dialogClose)="onClose()">
 *   <ng-template #headerModal>
 *     <h2>Modal Title</h2>
 *   </ng-template>
 *   <p>Modal content goes here</p>
 *   <ng-template #footerModal>
 *     <button (click)="onClose()">Close</button>
 *   </ng-template>
 * </sq-modal-base>
 * ```
 *
 * @example
 * Programmatic usage via service:
 * ```typescript
 * const ref = this.modalService.openModal({
 *   size: 'lg',
 *   body: MyContentComponent,
 *   data: { title: 'Hello' }
 * });
 *
 * ref.afterClosed().subscribe(result => {
 *   console.log('Modal closed with:', result);
 * });
 * ```
 */
@Component({
  selector: 'sq-modal-base',
  templateUrl: './sq-modal-base.component.html',
  styleUrls: ['./sq-modal-base.component.scss'],
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, SqClickOutsideDirective, SqDataTestDirective],
})
export class SqModalBaseComponent extends SqDialogCore {
  /**
   * Unique style ID for dynamic CSS injection.
   */
  protected override styleId = `modal-style-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  /**
   * Size of the modal dialog.
   * Maps to CSS classes: .modal-sm, .modal-md, .modal-lg, .modal-xl
   */
  @Input() size: ModalSizeType = 'md';

  /**
   * Header template from content projection.
   */
  @ContentChild('headerModal') override headerTemplate?: TemplateRef<ElementRef>;

  /**
   * Footer template from content projection.
   */
  @ContentChild('footerModal') override footerTemplate?: TemplateRef<ElementRef>;

  /**
   * Get CSS classes for the modal container.
   *
   * @returns Object with CSS class names as keys and boolean values
   */
  override getDialogClasses(): Record<string, boolean> {
    return {
      modal: true,
      'align-items-center': true,
      open: this.open,
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
      [`modal-${this.size}`]: true,
    };
  }

  /**
   * Hook called when the modal opens.
   */
  protected override onDialogOpen(): void {
    // Update header/footer detection for content-projected templates
    this.hasHeader = this.showHeader;
    this.hasFooter = this.showFooter;
  }

  /**
   * Hook called when the modal closes.
   */
  protected override onDialogClose(): void {
    // No specific cleanup needed for modal
  }
}
