import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  forwardRef,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
} from '@angular/forms';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';
import { Subject, takeUntil } from 'rxjs';

/**
 * Componente de seletor (checkbox/radio/toggle) moderno que implementa ControlValueAccessor e Validator.
 * Versão melhorada do sq-selector com suporte completo a Reactive Forms.
 *
 * Usa um FormControl interno para gerenciar o estado checked.
 * Suporta customização de cores, labels customizados via templates, e estado indeterminado.
 *
 * @example
 * ```html
 * <!-- Checkbox simples -->
 * <sq-selector-form-control
 *   [formControl]="termsControl"
 *   [label]="'Aceito os termos'"
 *   [type]="'checkbox'"
 *   [required]="true"
 * ></sq-selector-form-control>
 *
 * <!-- Toggle -->
 * <sq-selector-form-control
 *   [formControl]="notificationsControl"
 *   [label]="'Receber notificações'"
 *   [toggle]="true"
 *   [colorBackground]="'#007bff'"
 * ></sq-selector-form-control>
 *
 * <!-- Radio button -->
 * <sq-selector-form-control
 *   [formControl]="paymentControl"
 *   [label]="'Cartão de Crédito'"
 *   [type]="'radio'"
 *   [value]="'credit_card'"
 * ></sq-selector-form-control>
 * ```
 */
@Component({
  selector: 'sq-selector-form-control',
  templateUrl: './sq-selector-form-control.component.html',
  styleUrls: ['./sq-selector-form-control.component.scss'],
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, ReactiveFormsModule, UniversalSafePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SqSelectorFormControlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SqSelectorFormControlComponent),
      multi: true,
    },
  ],
})
export class SqSelectorFormControlComponent implements ControlValueAccessor, Validator, OnChanges, OnDestroy {
  /**
   * The name attribute for the selector input.
   */
  @Input() name = '';

  /**
   * The type of selector: 'checkbox' or 'radio'.
   * @default 'checkbox'
   */
  @Input() type: 'checkbox' | 'radio' = 'checkbox';

  /**
   * The id attribute for the selector input.
   */
  @Input() id?: string;

  /**
   * The value associated with the selector (useful for radio buttons and multi-select scenarios).
   */
  @Input() value: any = '';

  /**
   * Indicates whether the selector input is checked.
   * This is managed internally by the FormControl, but can be set initially.
   */
  @Input() checked = false;

  /**
   * Indicates whether the selector input is in an indeterminate state.
   * Only applicable for checkboxes.
   */
  @Input() indeterminate = false;

  /**
   * Text color for the selector label.
   */
  @Input() colorText = '';

  /**
   * Background color for the selector input when checked.
   * @default 'var(--green-50)'
   */
  @Input() colorBackground = 'var(--green-50)';

  /**
   * Indicates whether to hide the actual input element.
   * Useful when you want only the custom styled checkbox/radio visible.
   */
  @Input() hideInput = false;

  /**
   * Indicates whether the selector supports toggle behavior (switch style).
   */
  @Input() toggle = false;

  /**
   * The label text for the selector input.
   */
  @Input() label = '';

  /**
   * Block (width: 100%) the selector input.
   */
  @Input() block = false;

  /**
   * Content child for the left label template.
   */
  @ContentChild('leftLabel')
  leftLabel: TemplateRef<HTMLElement> | null = null;

  /**
   * Content child for the right label template.
   */
  @ContentChild('rightLabel')
  rightLabel: TemplateRef<HTMLElement> | null = null;

  /**
   * Content child for the label template.
   */
  @ContentChild('labelTemplate')
  labelTemplate: TemplateRef<HTMLElement> | null = null;

  /**
   * Internal FormControl for managing the checked state.
   */
  control = new FormControl(false);

  /**
   * Indicates whether the selector input is currently checked (internal state).
   */
  thisChecked = false;

  /**
   * Indicates whether the selector input is in an indeterminate state (internal state).
   */
  thisIndeterminate = false;

  /**
   * Context object containing selector properties for template usage.
   */
  context: any = {
    checked: this.thisChecked,
    indeterminate: !this.thisChecked ? this.thisIndeterminate : false,
    value: this.value,
  };

  /**
   * ChangeDetectorRef for manual change detection with OnPush strategy.
   */
  private cdr = inject(ChangeDetectorRef);

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
  public onTouched: () => void = () => {};

  /**
   * External validator function (propagated from parent control).
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onValidationChange: () => void = () => {};

  /**
   * Constructor that initializes the component.
   * Sets up value change subscriptions.
   */
  constructor() {
    // Subscribe to internal control value changes
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      // Para radio buttons, checked é determinado comparando valores
      // Para checkbox/toggle, checked é o valor booleano
      if (this.type === 'radio') {
        this.thisChecked = value === this.value;
        this.onChange(value);
      } else {
        this.thisChecked = !!value;
        this.onChange(!!value);
      }

      this.context.checked = this.thisChecked;
      this.context.indeterminate = !this.thisChecked ? this.thisIndeterminate : false;

      // valueChange removido - use control.valueChanges
      this.cdr.markForCheck();
    });
  }

  /**
   * Lifecycle hook called when any input property changes.
   * Updates internal state when checked, indeterminate, or value changes.
   * @param changes - An object containing changed input properties
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checked']) {
      this.thisChecked = this.checked;
      if (this.type !== 'radio') {
        this.control.setValue(this.checked, { emitEvent: false });
      }
      this.context.checked = this.thisChecked;
      this.cdr.markForCheck();
    }
    if (changes['indeterminate']) {
      this.thisIndeterminate = this.indeterminate;
      this.context.indeterminate = !this.thisChecked ? this.thisIndeterminate : false;
      this.cdr.markForCheck();
    }
    if (changes['value']) {
      this.context.value = this.value;
      // Para radio, precisamos recalcular checked quando o valor muda
      if (this.type === 'radio') {
        this.thisChecked = this.control.value === this.value;
        this.context.checked = this.thisChecked;
      }
      this.cdr.markForCheck();
    }
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
   * @param value - The new value (boolean for checkbox, string for radio)
   */
  writeValue(value: any): void {
    if (this.type === 'radio') {
      // Para radio, o valor é a string do radio selecionado
      this.thisChecked = value === this.value;
      this.control.setValue(value, { emitEvent: false });
    } else {
      // Para checkbox, o valor é booleano
      const checked = !!value;
      this.thisChecked = checked;
      this.control.setValue(checked, { emitEvent: false });
    }

    this.context.checked = this.thisChecked;
    this.context.indeterminate = !this.thisChecked ? this.thisIndeterminate : false;

    // Força atualização da view com OnPush
    this.cdr.markForCheck();
    // Força detecção de mudanças imediata
    this.cdr.detectChanges();
  }

  /**
   * ControlValueAccessor: Registers a callback function that is called when the control's value changes.
   * @param fn - The callback function
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * ControlValueAccessor: Registers a callback function that is called when the control is touched.
   * @param fn - The callback function
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * ControlValueAccessor: Sets the disabled state of the control.
   * @param isDisabled - Whether the control should be disabled
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
    this.cdr.markForCheck();
  }

  /**
   * Validator: Validates the control.
   * Returns null as validation is handled by Angular's built-in validators.
   * @returns Validation errors or null
   */
  validate(): ValidationErrors | null {
    return this.control.errors;
  }

  /**
   * Validator: Registers a callback for validation changes.
   * @param fn - The callback function
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
   * Getter for the readonly state (derived from disabled).
   */
  get readonly(): boolean {
    return this.control.disabled;
  }

  /**
   * Handles the change event from the native input element.
   * For radio buttons, emits the value of the selected radio.
   * For checkboxes, emits the boolean checked state.
   * @param event - The change event from the input element
   */
  change(event: any): void {
    const checked = event?.target?.checked ?? false;

    if (this.type === 'radio') {
      // Para radio, emite o valor do radio selecionado
      const newValue = checked ? this.value : null;
      this.control.setValue(newValue);
    } else {
      // Para checkbox, emite o estado booleano
      this.control.setValue(checked);
    }

    this.onTouched();
  }
}
