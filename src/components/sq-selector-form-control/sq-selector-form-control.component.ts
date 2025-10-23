import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  forwardRef,
  OnDestroy,
  OnInit,
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
export class SqSelectorFormControlComponent implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy {
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
   * Explicitly set the disabled state (can also be controlled via FormControl).
   */
  @Input() disabled = false;

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
   * Esta é a fonte única de verdade para o estado do componente.
   */
  control = new FormControl(false);

  /**
   * Indicates whether the selector input is in an indeterminate state (internal state).
   */
  thisIndeterminate = false;

  /**
   * ID único gerado automaticamente para o input interno.
   * Sempre aleatório para evitar conflitos, independente do @Input id.
   */
  private readonly internalInputId = `sq-selector-${Math.random().toString(36).substring(2, 11)}`;

  /**
   * ChangeDetectorRef for manual change detection with OnPush strategy.
   */
  private cdr = inject(ChangeDetectorRef);

  /**
   * Getter para o estado checked.
   * Fonte única de verdade: control.value
   */
  get isChecked(): boolean {
    if (this.type === 'radio') {
      return this.control.value === this.value;
    }
    return !!this.control.value;
  }

  /**
   * Context object para templates customizados.
   * Calculado dinamicamente a partir do control.value
   */
  get context(): any {
    return {
      checked: this.isChecked,
      indeterminate: !this.isChecked ? this.thisIndeterminate : false,
      value: this.value,
    };
  }

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
   * Sets up value change subscriptions to propagate to the parent FormControl.
   */
  constructor() {
    // Propaga mudanças do FormControl interno para o FormControl pai
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.onChange(value);
      this.cdr.markForCheck();
    });
  }

  /**
   * Lifecycle hook called on component initialization.
   * Ensures initial disabled state is set correctly.
   */
  ngOnInit(): void {
    // Se o input disabled foi definido na inicialização, sincroniza com o control interno
    if (this.disabled) {
      this.control.disable({ emitEvent: false });
      this.cdr.markForCheck();
    }
  }

  /**
   * Lifecycle hook called when any input property changes.
   * Updates internal state when checked, indeterminate, or value changes.
   * @param changes - An object containing changed input properties
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checked'] && this.type !== 'radio') {
      // Para checkbox/toggle, sincroniza o @Input checked com o control
      this.control.setValue(this.checked, { emitEvent: false });
      this.cdr.markForCheck();
    }

    if (changes['indeterminate']) {
      this.thisIndeterminate = this.indeterminate;
      this.cdr.markForCheck();
    }

    if (changes['value'] || changes['disabled']) {
      // Para radio, o valor muda como isChecked é calculado
      // Para disabled, sincroniza com o control
      if (changes['disabled']) {
        if (this.disabled) {
          this.control.disable({ emitEvent: false });
        } else {
          this.control.enable({ emitEvent: false });
        }
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
   * @param value - The new value (boolean for checkbox/toggle, string for radio)
   */
  writeValue(value: any): void {
    // Atualiza o FormControl interno (fonte única de verdade)
    // Para checkbox/toggle: valor booleano
    // Para radio: string do valor selecionado
    if (this.type === 'radio') {
      this.control.setValue(value, { emitEvent: false });
    } else {
      this.control.setValue(!!value, { emitEvent: false });
    }

    this.cdr.markForCheck();
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
   * Called by Angular when the FormControl's disabled state changes.
   * @param isDisabled - Whether the control should be disabled
   */
  setDisabledState(isDisabled: boolean): void {
    // Sincroniza com o control interno (fonte única de verdade)
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
   * Uses the internal FormControl as the single source of truth.
   */
  get isDisabled(): boolean {
    return this.control.disabled;
  }

  /**
   * Getter para o ID interno do input.
   * Sempre retorna o ID gerado automaticamente (nunca o @Input id).
   */
  get inputId(): string {
    return this.internalInputId;
  }

  /**
   * Handles the change event from the native input element.
   * For radio buttons, sets the value of the selected radio.
   * For checkboxes/toggles, sets the boolean checked state.
   * @param event - The change event from the input element
   */
  change(event: any): void {
    // Se está desabilitado, ignora o evento
    if (this.isDisabled) {
      return;
    }

    const checked = event?.target?.checked ?? false;
    const newValue = this.type === 'radio' ? (checked ? this.value : null) : checked;

    // Atualiza o FormControl interno
    // A subscription no constructor vai propagar para o FormControl pai via onChange()
    this.control.setValue(newValue);
    this.onTouched();
  }
}
