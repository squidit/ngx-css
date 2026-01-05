import { ControlValueAccessor, FormControl } from '@angular/forms';
import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';

/**
 * Diretiva base para componentes de formulário que implementam ControlValueAccessor.
 * 
 * Fornece funcionalidades comuns para componentes de formulário, incluindo:
 * - Gerenciamento de estado interno via FormControl
 * - Integração com Reactive Forms
 * - Emissão de eventos (valueChange, focused, blurred)
 * - Suporte a propriedades comuns (label, placeholder, readonly, tooltip, etc.)
 * - Gerenciamento de ciclo de vida e subscriptions
 * 
 * Componentes que estendem esta diretiva devem implementar:
 * - O template HTML do componente
 * - Lógica específica de atualização do valor (se necessário)
 * - Override de writeValue() se necessário para lógica customizada
 * 
 * @example
 * ```typescript
 * @Component({
 *   selector: 'my-custom-input',
 *   template: '<input [formControl]="control" />',
 * })
 * export class MyCustomInputComponent extends SqFormControlBaseDirective {
 *   // Componente automaticamente integrado com Reactive Forms
 * }
 * ```
 */
@Directive({
  standalone: true,
})
export class SqFormControlBaseDirective implements ControlValueAccessor, OnInit, OnDestroy {
  /**
   * The name attribute for the input element.
   *
   * @default 'random-name-[hash-random-code]'
   */
  @Input() name = `random-name-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`;

  /**
   * The id attribute for the input element.
   */
  @Input() id?: string;

  /**
   * An optional label for the input.
   */
  @Input() label?: string;

  /**
   * Custom CSS class for the input element.
   */
  @Input() customClass = '';

  /**
   * Placeholder text for the input element.
   */
  @Input() placeholder = '';

  /**
   * Flag to make the input element readonly.
   */
  @Input() readonly = false;

  /**
   * Tooltip message to display.
   */
  @Input() tooltipMessage = '';

  /**
   * Placement of the tooltip.
   */
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center';

  /**
   * Color of the tooltip.
   */
  @Input() tooltipColor = 'inherit';

  /**
   * Icon for the tooltip.
   */
  @Input() tooltipIcon = '';

  /**
   * Event emitter for input value changes.
   */
  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  /**
   * Event emitter for focus events.
   */
  @Output() focused: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  /**
   * Event emitter for blur events.
   */
  @Output() blurred: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  /**
   * Internal FormControl for managing the input value and state.
   */
  control = new FormControl<any>(null);

  /**
   * Subject for managing subscriptions.
   */
  protected destroy$ = new Subject<void>();

  /**
   * ControlValueAccessor callback function called when the value changes.
   * Registered via registerOnChange().
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onChange: (value: any) => void = () => {};

  /**
   * ControlValueAccessor callback function called when the control is touched.
   * Registered via registerOnTouched().
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onTouched: () => void = () => {};

  /**
   * Lifecycle hook that sets up value change subscriptions with optional debounce.
   */
  ngOnInit(): void {
    this.watchValueChanges();
  }

  /**
   * Cleanup on component destruction.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * ControlValueAccessor: Writes a new value to the element.
   * @param value - The new value.
   */
  writeValue(value: any): void {
    this.control.setValue(value ?? null, { emitEvent: false });
  }

  /**
   * ControlValueAccessor: Registers a callback function that is called when the control's value changes.
   * @param fn - The callback function.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * ControlValueAccessor: Registers a callback function that is called when the control is touched.
   * @param fn - The callback function.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * ControlValueAccessor: Sets the disabled state of the control.
   * @param isDisabled - Whether the control should be disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
  }

  /**
   * Getter for the disabled state.
   * @returns true if the control is disabled, false otherwise.
   */
  get disabled(): boolean {
    return this.control.disabled;
  }

  /**
   * Getter for the current value of the control.
   * @returns The current value of the control.
   */
  get value(): any {
    return this.control.value;
  }

  /**
   * Handle blur events.
   * Marks the control as touched when the user leaves the input.
   * @param event - The focus event that triggered the blur.
   */
  onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }

  /**
   * Handle focus events.
   * Emits the focused event when the input receives focus.
   * @param event - The focus event that triggered the focus.
   */
  onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  /**
   * Watch for value changes and emit the value to the parent component.
   * Subscribes to control.valueChanges with distinctUntilChanged to avoid duplicate emissions.
   * Automatically unsubscribes when the component is destroyed.
   */
  protected watchValueChanges(): void {
    this.control.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(value => {
      this.onChange(value);
      this.valueChange.emit(value);
    });
  }
}
