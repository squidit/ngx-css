import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  forwardRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
} from '@angular/forms';
import { SqTooltipComponent } from '../sq-tooltip/sq-tooltip.component';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';
import { Subject, takeUntil } from 'rxjs';
import { InputValidators } from '../../validators/input.validators';

/**
 * Componente de input moderno que implementa ControlValueAccessor e Validator.
 * Versão melhorada do sq-input com suporte completo a Reactive Forms.
 *
 * Usa um FormControl interno para gerenciar o valor e estado.
 * Aplica automaticamente validators baseados no tipo (email, tel, url).
 * Suporta debounce, customização de estilos, tooltips, e templates customizados.
 *
 * @example
 * ```html
 * <sq-input-form-control
 *   [formControl]="emailControl"
 *   [label]="'Email'"
 *   [type]="'email'"
 *   [placeholder]="'seu@email.com'"
 *   [required]="true"
 *   [tooltipMessage]="'Digite um email válido'"
 * ></sq-input-form-control>
 * ```
 */
@Component({
  selector: 'sq-input-form-control',
  templateUrl: './sq-input-form-control.component.html',
  styleUrls: ['./sq-input-form-control.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet, ReactiveFormsModule, SqTooltipComponent, UniversalSafePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SqInputFormControlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SqInputFormControlComponent),
      multi: true,
    },
  ],
})
export class SqInputFormControlComponent implements ControlValueAccessor, Validator, OnChanges, OnDestroy {
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
   * Time in milliseconds before triggering input timeout (debounce).
   */
  @Input() timeToChange = 0;

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
   * Background color of the input element.
   */
  @Input() backgroundColor = '';

  /**
   * Border color of the input element.
   */
  @Input() borderColor = '';

  /**
   * Color of the input label.
   */
  @Input() labelColor = '';

  /**
   * Type of the input element (e.g., text, email, password).
   */
  @Input() type: 'text' | 'email' | 'email-multiple' | 'hidden' | 'password' | 'tel' | 'url' | 'file' = 'text';

  /**
   * Maximum length for the input element.
   */
  @Input() maxLength: number | null = null;

  /**
   * Regular expression pattern for input validation.
   */
  @Input() pattern = '';

  /**
   * Input mode for mobile devices.
   */
  @Input() inputMode = '';

  /**
   * Event emitter for keydown events.
   */
  @Output() keyPressDown: EventEmitter<KeyboardEvent> = new EventEmitter();

  /**
   * Event emitter for keyup events.
   */
  @Output() keyPressUp: EventEmitter<KeyboardEvent> = new EventEmitter();

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
   * Reference to a left-aligned label template.
   */
  @ContentChild('leftLabel')
  leftLabel: TemplateRef<HTMLElement> | null = null;

  /**
   * Reference to a right-aligned label template.
   */
  @ContentChild('rightLabel')
  rightLabel: TemplateRef<HTMLElement> | null = null;

  /**
   * Reference to a label template.
   */
  @ContentChild('labelTemplate')
  labelTemplate: TemplateRef<HTMLElement> | null = null;

  /**
   * Internal FormControl for managing the input value and state.
   */
  control = new FormControl('');

  /**
   * Reference to the native element.
   */
  nativeElement: ElementRef = inject(ElementRef);

  /**
   * Timeout for input changes (debounce).
   */
  private timeoutInput?: ReturnType<typeof setTimeout>;

  /**
   * Subject for managing subscriptions.
   */
  private destroy$ = new Subject<void>();

  /**
   * ControlValueAccessor callback function called when the value changes.
   * Registered via registerOnChange().
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: any) => void = () => {};

  /**
   * ControlValueAccessor callback function called when the control is touched.
   * Registered via registerOnTouched().
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  /**
   * External validator function (propagated from parent control).
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onValidationChange: () => void = () => {};

  /**
   * Constructor that initializes the component.
   * Sets up value change subscriptions and initial validators.
   */
  constructor() {
    // Subscribe to internal control value changes
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.onChange(value);
      this.valueChange.emit(value);
    });

    // Apply initial validators based on type
    this.updateValidators();
  }

  /**
   * Lifecycle hook called when any input property changes.
   * Updates validators when the type changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type']) {
      this.updateValidators();
    }
  }

  /**
   * Updates validators based on the input type.
   * Automatically applies appropriate validators for email, phone, URL, etc.
   * Uses ValidatorHelper through InputValidators for consistency.
   */
  private updateValidators(): void {
    const validators = [];

    switch (this.type) {
      case 'email':
        // Use our custom email validator (wraps ValidatorHelper.email)
        validators.push(InputValidators.email());
        break;
      case 'email-multiple':
        validators.push(InputValidators.emailMultiple());
        break;
      case 'tel':
        validators.push(InputValidators.phone());
        break;
      case 'url':
        validators.push(InputValidators.url());
        break;
    }

    // Update the control's validators
    this.control.setValidators(validators.length > 0 ? validators : null);
    this.control.updateValueAndValidity({ emitEvent: false });

    // Notify parent control that validators changed
    this.onValidationChange();
  }

  /**
   * Cleanup on component destruction.
   */
  ngOnDestroy(): void {
    if (this.timeoutInput) {
      clearTimeout(this.timeoutInput);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * ControlValueAccessor: Writes a new value to the element.
   * @param value - The new value.
   */
  writeValue(value: any): void {
    this.control.setValue(value ?? '', { emitEvent: false });
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
   * Validator: Validates the control.
   * @returns Validation errors or null.
   */
  validate(): ValidationErrors | null {
    // The component doesn't have custom validation logic
    // It propagates the internal control's validation state
    return this.control.errors;
  }

  /**
   * Validator: Registers a callback for validation changes.
   * @param fn - The callback function.
   */
  registerOnValidatorChange(fn: () => void): void {
    this.onValidationChange = fn;
  }

  /**
   * Getter for the disabled state.
   */
  get disabled(): boolean {
    return this.control.disabled;
  }

  /**
   * Getter for the value.
   */
  get value(): any {
    return this.control.value;
  }

  /**
   * Handle input value changes with optional debounce.
   * @param value - The input value.
   */
  onChangeEvent(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (this.timeoutInput) {
      clearTimeout(this.timeoutInput);
    }

    if (this.timeToChange > 0) {
      this.timeoutInput = setTimeout(() => {
        this.control.setValue(value);
      }, this.timeToChange);
    } else {
      this.control.setValue(value);
    }
  }

  /**
   * Handle keydown events.
   * @param event - The keydown event.
   */
  onKeyDown(event: KeyboardEvent): void {
    this.keyPressDown.emit(event);
  }

  /**
   * Handle keyup events.
   * @param event - The keyup event.
   */
  onKeyUp(event: KeyboardEvent): void {
    this.keyPressUp.emit(event);
  }

  /**
   * Handle blur events.
   */
  onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }

  /**
   * Handle focus events.
   */
  onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }
}
