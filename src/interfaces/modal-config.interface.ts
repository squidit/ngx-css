import { Type, TemplateRef } from '@angular/core';

/**
 * Configuration options for the modal/overlay.
 */
export interface SqModalConfig<T = any> {
  /**
   * Type of modal to display.
   * - 'modal': Centered modal dialog
   * - 'overlay': Side panel (left/right)
   */
  type?: 'modal' | 'overlay';

  /**
   * Size of the modal (for type='modal' only).
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

  /**
   * Direction of the overlay (for type='overlay' only).
   */
  direction?: 'left' | 'right' | 'top' | 'bottom';

  /**
   * Width of the overlay (for type='overlay' only).
   */
  width?: string;

  /**
   * Backdrop behavior.
   * - 'static': Clicking outside does not close
   * - 'true': Clicking outside closes the modal
   */
  backdrop?: 'static' | 'true';

  /**
   * Show/hide the close button.
   */
  showCloseButton?: boolean;

  /**
   * Additional CSS class for the modal.
   */
  customClass?: string;

  /**
   * Additional CSS class for the backdrop.
   */
  backdropClass?: string;

  /**
   * Header padding.
   */
  headerPadding?: string;

  /**
   * Body padding.
   */
  bodyPadding?: string;

  /**
   * Footer padding.
   */
  footerPadding?: string;

  /**
   * Header background color.
   */
  headerBgColor?: string;

  /**
   * Body background color.
   */
  bodyBgColor?: string;

  /**
   * Footer background color.
   */
  footerBgColor?: string;

  /**
   * Remove borders (for overlay).
   */
  borderless?: boolean;

  /**
   * Header items text color (for overlay).
   */
  headerItemsColor?: string;

  /**
   * Data to pass to the dynamically injected component.
   */
  data?: T;

  /**
   * Custom data-test attribute.
   */
  dataTest?: string;

  /**
   * Title to display in the default header.
   * Only used when headerTemplate is not provided.
   */
  title?: string;

  /**
   * Custom header template.
   * The template receives the modalRef via context: { $implicit: modalRef, modalRef }
   */
  headerTemplate?: TemplateRef<any>;

  /**
   * Custom footer template.
   * The template receives the modalRef via context: { $implicit: modalRef, modalRef }
   */
  footerTemplate?: TemplateRef<any>;

  /**
   * Text for the cancel button in the default footer.
   * Default: 'Fechar'
   */
  cancelButtonText?: string;

  /**
   * Text for the confirm button in the default footer.
   * Default: 'Concluir'
   */
  confirmButtonText?: string;

  /**
   * Show default footer buttons.
   * If false, no default footer is shown (unless footerTemplate is provided).
   * Default: true
   */
  showFooterButtons?: boolean;
}

/**
 * Optional interface that content components can implement to provide custom templates.
 * If implemented, SqModalManagerService will detect and pass these templates to SqModalBaseComponent.
 */
export interface SqModalContentComponent {
  /**
   * Custom header template to override the default header.
   */
  customHeaderTemplate?: TemplateRef<any>;

  /**
   * Custom footer template to override the default footer.
   */
  customFooterTemplate?: TemplateRef<any>;
}

/**
 * Reference to an open modal instance.
 */
export interface SqModalRef<T = any, R = any> {
  /**
   * Unique identifier for this modal instance.
   */
  id: string;

  /**
   * Close the modal and optionally return a result.
   */
  close(result?: R): void;

  /**
   * Update data in the dynamically injected component.
   */
  updateData(data: Partial<T>): void;

  /**
   * Observable that emits when the modal is closed.
   */
  afterClosed(): import('rxjs').Observable<R | undefined>;
}

/**
 * Internal modal instance data used by SqModalManagerService.
 */
export interface SqModalInstance<T = any, R = any> {
  /**
   * Unique identifier for this modal instance.
   */
  id: string;

  /**
   * The component type to be dynamically injected into the modal.
   */
  component: Type<T> | null;

  /**
   * Configuration options for the modal.
   */
  config: SqModalConfig<T>;

  /**
   * Data to pass to the dynamically injected component.
   */
  data?: T;

  /**
   * Subject that emits when the modal is closed with a result.
   */
  resultSubject: import('rxjs').Subject<R | undefined>;

  /**
   * Reference to the SqModalBaseComponent wrapper.
   */
  componentRef?: import('@angular/core').ComponentRef<any>;

  /**
   * Reference to the content component inside the wrapper.
   */
  contentComponentRef?: import('@angular/core').ComponentRef<T>;

  /**
   * Flag to prevent duplicate cleanup operations.
   */
  isClosing?: boolean;
}

