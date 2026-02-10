import { TemplateRef, Type } from '@angular/core';
import { Observable, Subject, from, of, isObservable, OperatorFunction } from 'rxjs';
import { take, map } from 'rxjs/operators';

/**
 * Type for the beforeClose guard function.
 * Can return boolean, Promise<boolean>, or Observable<boolean>.
 */
export type BeforeCloseGuard = () => boolean | Promise<boolean> | Observable<boolean>;

/**
 * Available sizes for modal dialogs.
 */
export type ModalSizeType = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Available directions for overlay dialogs.
 */
export type OverlayDirectionType = 'left' | 'right' | 'top' | 'bottom';

/**
 * Base configuration shared by modal and overlay dialogs.
 *
 * @template T - Type of data passed to the dialog content component
 */
export interface SqDialogConfig<T = any> {
  /**
   * Unique identifier for the dialog instance.
   * Auto-generated if not provided.
   */
  id?: string;

  /**
   * Backdrop behavior.
   * - 'static': Clicking outside does not close the dialog
   * - true: Clicking outside closes the dialog
   *
   * @default 'static'
   */
  backdrop?: 'static' | true;

  /**
   * Whether to show the close button in the header.
   *
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Whether to show the header section.
   *
   * @default true
   */
  showHeader?: boolean;

  /**
   * Whether to show the footer section.
   *
   * @default true
   */
  showFooter?: boolean;

  /**
   * Additional CSS class(es) to apply to the dialog container.
   */
  customClass?: string;

  /**
   * Data to pass to the content component.
   * Available via injection or input binding.
   */
  data?: T;

  /**
   * Output handlers for the body component.
   * Keys must match the names of the body component's @Output() EventEmitters.
   *
   * @example
   * ```typescript
   * openModal({
   *   body: MyFormComponent,
   *   data: { id: 1 },
   *   outputs: {
   *     save: (value) => this.onSave(value),
   *     cancel: () => this.close(),
   *   }
   * });
   * ```
   */
  outputs?: { [outputName: string]: (value?: any) => void };

  /**
   * Custom header content.
   * Can be a string (used as title) or TemplateRef.
   * If body is a Component with headerTemplate property, it will be used automatically.
   */
  header?: string | TemplateRef<any>;

  /**
   * Custom body content.
   * Can be a TemplateRef or a Component type.
   * If a Component is passed, its headerTemplate and footerTemplate properties will be used.
   */
  body?: TemplateRef<any> | Type<any>;

  /**
   * Custom footer content (TemplateRef only).
   * If body is a Component with footerTemplate property, it will be used automatically.
   */
  footer?: TemplateRef<any>;

  /**
   * Data-test attribute for testing purposes.
   */
  dataTest?: string;

  /**
   * Text for the cancel button in the default footer.
   *
   * @default 'Cancelar'
   */
  cancelText?: string;

  /**
   * Text for the confirm button in the default footer.
   *
   * @default 'Confirmar'
   */
  confirmText?: string;
}

/**
 * Configuration specific to modal dialogs.
 *
 * @template T - Type of data passed to the dialog content component
 */
export interface SqModalConfig<T = any> extends SqDialogConfig<T> {
  /**
   * Size of the modal dialog.
   *
   * @default 'md'
   */
  size?: ModalSizeType;
}

/**
 * Configuration specific to overlay (side panel) dialogs.
 *
 * @template T - Type of data passed to the dialog content component
 */
export interface SqOverlayConfig<T = any> extends SqDialogConfig<T> {
  /**
   * Direction from which the overlay slides in.
   *
   * @default 'right'
   */
  direction?: OverlayDirectionType;

  /**
   * Width of the overlay panel (used for left/right directions).
   *
   * @default '475px'
   */
  width?: string;

  /**
   * Height of the overlay panel (used for top/bottom directions).
   *
   * @default '300px'
   */
  height?: string;

  /**
   * Whether to hide borders in the overlay.
   *
   * @default false
   */
  borderless?: boolean;
}

/**
 * Reference to an open dialog instance.
 * Extends Observable to allow direct use of pipe() and subscribe().
 *
 * @example
 * ```typescript
 * // Direct subscription
 * this.modalService.openModal({...}).subscribe(result => {...});
 *
 * // With pipe and cancel confirmation
 * this.modalService.openModal({...})
 *   .pipe(
 *     confirmBeforeClose(() => confirm('Deseja realmente cancelar?'))
 *   )
 *   .subscribe(result => {...});
 *
 * // Access dialog methods
 * const ref = this.modalService.openModal({...});
 * ref.close(result);
 * ref.updateData({ newProp: 'value' });
 * ```
 *
 * @template T - Type of data passed to the dialog
 * @template R - Type of result returned when dialog closes
 */
export class SqDialogRef<T = any, R = any> extends Observable<R | undefined> {
  /**
   * Guard function to call before closing without a result.
   * @internal
   */
  private _beforeCloseGuard?: BeforeCloseGuard;

  /**
   * Creates a new SqDialogRef instance.
   *
   * @param _id - Unique identifier for the dialog
   * @param _resultSubject - Subject for emitting close results
   * @param _closeHandler - Handler function to close the dialog
   * @param _updateDataHandler - Handler function to update dialog data
   */
  constructor(
    private readonly _id: string,
    private readonly _resultSubject: Subject<R | undefined>,
    private readonly _closeHandler: (result?: R, force?: boolean) => void,
    private readonly _updateDataHandler: (data: Partial<T>) => void
  ) {
    super(subscriber => {
      return this._resultSubject.asObservable().subscribe(subscriber);
    });
  }

  /**
   * Unique identifier of the dialog instance.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Close the dialog and optionally return a result.
   * If a beforeClose guard is set and no result is provided (cancel),
   * the guard will be called first.
   *
   * @param result - Optional result to pass to subscribers
   */
  close(result?: R): void {
    // If there's a result, it's a confirmation - close directly
    if (result !== undefined) {
      this._closeHandler(result);
      return;
    }

    // No result means cancel - check beforeClose guard
    if (this._beforeCloseGuard) {
      const guardResult = this._beforeCloseGuard();

      // Convert to Observable
      const guard$ = isObservable(guardResult)
        ? guardResult
        : guardResult instanceof Promise
          ? from(guardResult)
          : of(guardResult);

      guard$.pipe(take(1)).subscribe(canClose => {
        if (canClose) {
          this._closeHandler(undefined, true);
        }
        // If false, do nothing - keep modal open
      });
    } else {
      // No guard - close directly
      this._closeHandler(result);
    }
  }

  /**
   * Set a guard function to be called before closing without a result.
   * Used by the confirmBeforeClose operator.
   *
   * @internal
   */
  setBeforeCloseGuard(guard: BeforeCloseGuard): void {
    this._beforeCloseGuard = guard;
  }

  /**
   * Observable that emits when the dialog is closed.
   * @deprecated Use the SqDialogRef directly as an Observable instead.
   */
  afterClosed(): Observable<R | undefined> {
    return this._resultSubject.asObservable();
  }

  /**
   * Update data in the dialog's content component.
   *
   * @param data - Partial data object with properties to update
   */
  updateData(data: Partial<T>): void {
    this._updateDataHandler(data);
  }

  /**
   * Map the result when the dialog closes.
   * Returns a new Observable with the mapped result.
   *
   * @example
   * ```typescript
   * const ref = this.modalService.openModal({...});
   * ref.mapResult(result => result?.id || 0)
   *   .subscribe(id => console.log('ID:', id));
   * ```
   *
   * @template M - Type of the mapped result
   * @param mapper - Function to transform the result
   * @returns Observable with the mapped result
   */
  mapResult<M>(mapper: (result: R | undefined) => M): Observable<M> {
    return this._resultSubject.asObservable().pipe(map(mapper));
  }

  /**
   * Execute an action when the dialog closes.
   * Returns the same SqDialogRef instance for method chaining.
   *
   * @example
   * ```typescript
   * const ref = this.modalService.openModal({...});
   * ref.then(result => {
   *   console.log('Dialog closed with:', result);
   *   this.handleResult(result);
   * });
   * ```
   *
   * @param callback - Function to execute when dialog closes
   * @returns The same SqDialogRef instance for chaining
   */
  then(callback: (result: R | undefined) => void): SqDialogRef<T, R> {
    this._resultSubject.asObservable().pipe(take(1)).subscribe(callback);
    return this;
  }
}

/**
 * RxJS operator to add a confirmation guard before closing a dialog.
 * The guard is only called when closing without a result (cancel/close button).
 *
 * @example
 * ```typescript
 * this.modalService.openModal({...})
 *   .pipe(
 *     confirmBeforeClose(() => {
 *       // Can return boolean, Promise<boolean>, or Observable<boolean>
 *       return confirm('Deseja realmente cancelar?');
 *     })
 *   )
 *   .subscribe(result => {
 *     // Only called when dialog is actually closed
 *   });
 * ```
 *
 * @param guard - Function that returns whether to proceed with closing
 */
export function confirmBeforeClose<R>(guard: BeforeCloseGuard): OperatorFunction<R | undefined, R | undefined> {
  return (source: Observable<R | undefined>) => {
    // Get the SqDialogRef from the source if it's one
    if (source instanceof SqDialogRef) {
      source.setBeforeCloseGuard(guard);
    }
    return source;
  };
}

/**
 * Internal interface for tracking dialog instances in the service.
 * @internal
 */
export interface SqDialogInstance<T = any, R = any> {
  /**
   * Unique identifier of the dialog instance.
   */
  id: string;

  /**
   * Type of dialog: 'modal' or 'overlay'.
   */
  type: 'modal' | 'overlay';

  /**
   * Configuration options for the dialog.
   */
  config: SqModalConfig<T> | SqOverlayConfig<T>;

  /**
   * Subject for emitting the dialog result.
   */
  resultSubject: import('rxjs').Subject<R | undefined>;

  /**
   * Reference to the dialog component instance.
   */
  componentRef?: import('@angular/core').ComponentRef<any>;

  /**
   * References to dynamically created content components.
   */
  contentRefs?: {
    /** Header component reference. */
    header?: import('@angular/core').ComponentRef<any>;
    /** Body component reference. */
    body?: import('@angular/core').ComponentRef<any>;
    /** Footer component reference. */
    footer?: import('@angular/core').ComponentRef<any>;
  };
}
