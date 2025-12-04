import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  forwardRef,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
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
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';
import { Subject, takeUntil } from 'rxjs';

/**
 * Interface para valor de range duplo (intervalo).
 * Utilizada quando o componente está no modo `dualRange`.
 *
 * @example
 * ```typescript
 * const range: RangeValue = { min: 10, max: 90 };
 * ```
 */
export interface RangeValue {
  /**
   * Valor mínimo do intervalo selecionado.
   */
  min: number;
  /**
   * Valor máximo do intervalo selecionado.
   */
  max: number;
}

/**
 * Componente de input range (slider) baseado em Reactive Forms.
 * Permite selecionar um valor numérico dentro de um intervalo definido.
 * Suporta modo simples (um valor) ou modo range (dois valores - intervalo).
 *
 * @example
 * ```html
 * <!-- Modo simples -->
 * <sq-input-range-form-control
 *   [formControl]="volumeControl"
 *   [label]="'Volume'"
 *   [minNumber]="0"
 *   [maxNumber]="100"
 * ></sq-input-range-form-control>
 *
 * <!-- Modo range (intervalo) -->
 * <sq-input-range-form-control
 *   [formControl]="rangeControl"
 *   [label]="'Faixa de preço'"
 *   [minNumber]="0"
 *   [maxNumber]="1000"
 *   [dualRange]="true"
 * ></sq-input-range-form-control>
 * ```
 */
@Component({
  selector: 'sq-input-range-form-control',
  templateUrl: './sq-input-range-form-control.component.html',
  styleUrls: ['./sq-input-range-form-control.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet, ReactiveFormsModule, UniversalSafePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SqInputRangeFormControlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SqInputRangeFormControlComponent),
      multi: true,
    },
  ],
})
export class SqInputRangeFormControlComponent implements ControlValueAccessor, Validator, AfterViewInit, OnDestroy {
  /**
   * Nome do input.
   */
  @Input() name = `range-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  /**
   * ID do input.
   */
  @Input() id?: string;

  /**
   * Label do campo.
   */
  @Input() label = '';

  /**
   * Classe CSS customizada.
   */
  @Input() customClass = '';

  /**
   * Cor do thumb (bolinha) do slider.
   */
  @Input() color = 'var(--primary_color)';

  /**
   * Cor da track (linha) do slider.
   * Por padrão é transparente para compatibilidade.
   */
  @Input() trackColor = 'transparent';

  /**
   * Cor da label.
   */
  @Input() labelColor = '';

  /**
   * Valor mínimo do range.
   */
  @Input() minNumber = 0;

  /**
   * Valor máximo do range.
   */
  @Input() maxNumber = 100;

  /**
   * Incremento do slider.
   */
  @Input() step = 1;

  /**
   * Se o campo é somente leitura.
   */
  @Input() readonly = false;

  /**
   * Exibir o valor flutuante sobre o slider.
   */
  @Input() showValue = true;

  /**
   * Ativa o modo de range duplo (dois thumbs para selecionar intervalo).
   * Quando true, o valor será um objeto { min: number, max: number }.
   */
  @Input() dualRange = false;

  /**
   * Evento de foco.
   */
  @Output() focused: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  /**
   * Evento de blur.
   */
  @Output() blurred: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

  /**
   * Evento de mudança de valor.
   */
  @Output() valueChange: EventEmitter<number | RangeValue> = new EventEmitter<number | RangeValue>();

  /**
   * Template customizado para label.
   */
  @ContentChild('labelTemplate')
  labelTemplate: TemplateRef<HTMLElement> | null = null;

  /**
   * Referência ao elemento do valor flutuante.
   */
  @ViewChild('valueFloating') valueFloating?: ElementRef;

  /**
   * Referência ao elemento do valor flutuante mínimo (dual range).
   */
  @ViewChild('valueFloatingMin') valueFloatingMin?: ElementRef;

  /**
   * Referência ao elemento do valor flutuante máximo (dual range).
   */
  @ViewChild('valueFloatingMax') valueFloatingMax?: ElementRef;

  /**
   * FormControl interno para modo simples.
   */
  control = new FormControl<number>(0);

  /**
   * FormControl interno para valor mínimo (dual range).
   */
  controlMin = new FormControl<number>(0);

  /**
   * FormControl interno para valor máximo (dual range).
   */
  controlMax = new FormControl<number>(100);

  /**
   * Subject para cleanup de subscriptions.
   */
  private destroy$ = new Subject<void>();

  /**
   * Callback do ControlValueAccessor.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: number | RangeValue) => void = () => {};

  /**
   * Callback do ControlValueAccessor.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  /**
   * Callback do Validator.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onValidationChange: () => void = () => {};

  /**
   * ChangeDetectorRef injetado.
   */
  private cdr = inject(ChangeDetectorRef);

  /**
   * Construtor que inicializa subscriptions.
   */
  constructor() {
    // Subscription para modo simples
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (!this.dualRange) {
        const numValue = value ?? 0;
        this.onChange(numValue);
        this.valueChange.emit(numValue);
        this.updateValuePosition();
      }
    });

    // Subscriptions para modo dual range
    this.controlMin.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (this.dualRange) {
        const minVal = value ?? this.minNumber;
        const maxVal = this.controlMax.value ?? this.maxNumber;
        // Garante que min não ultrapasse max
        if (minVal > maxVal) {
          this.controlMin.setValue(maxVal, { emitEvent: false });
          return;
        }
        this.emitDualRangeValue();
      }
    });

    this.controlMax.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (this.dualRange) {
        const minVal = this.controlMin.value ?? this.minNumber;
        const maxVal = value ?? this.maxNumber;
        // Garante que max não seja menor que min
        if (maxVal < minVal) {
          this.controlMax.setValue(minVal, { emitEvent: false });
          return;
        }
        this.emitDualRangeValue();
      }
    });
  }

  /**
   * Lifecycle hook após a view ser inicializada.
   */
  ngAfterViewInit(): void {
    this.updateValuePosition();
  }

  /**
   * Cleanup.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * ControlValueAccessor: escreve valor.
   */
  writeValue(value: number | RangeValue | null): void {
    if (this.dualRange) {
      const rangeValue = value as RangeValue | null;
      this.controlMin.setValue(rangeValue?.min ?? this.minNumber, { emitEvent: false });
      this.controlMax.setValue(rangeValue?.max ?? this.maxNumber, { emitEvent: false });
    } else {
      const numValue = (value as number) ?? 0;
      this.control.setValue(numValue, { emitEvent: false });
    }
    this.updateValuePosition();
    this.cdr.markForCheck();
  }

  /**
   * ControlValueAccessor: registra onChange.
   */
  registerOnChange(fn: (value: number | RangeValue) => void): void {
    this.onChange = fn;
  }

  /**
   * ControlValueAccessor: registra onTouched.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * ControlValueAccessor: define estado disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
      this.controlMin.disable({ emitEvent: false });
      this.controlMax.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
      this.controlMin.enable({ emitEvent: false });
      this.controlMax.enable({ emitEvent: false });
    }
    this.cdr.markForCheck();
  }

  /**
   * Validator: valida o controle.
   */
  validate(): ValidationErrors | null {
    if (this.dualRange) {
      const minVal = this.controlMin.value ?? this.minNumber;
      const maxVal = this.controlMax.value ?? this.maxNumber;
      if (minVal > maxVal) {
        return { invalidRange: true };
      }
    }
    return this.control.errors;
  }

  /**
   * Validator: registra callback de validação.
   */
  registerOnValidatorChange(fn: () => void): void {
    this.onValidationChange = fn;
  }

  /**
   * Getter para estado disabled.
   */
  get disabled(): boolean {
    return this.control.disabled;
  }

  /**
   * Getter para valor atual (modo simples).
   */
  get value(): number {
    return this.control.value ?? 0;
  }

  /**
   * Getter para valor mínimo (dual range).
   */
  get minValue(): number {
    return this.controlMin.value ?? this.minNumber;
  }

  /**
   * Getter para valor máximo (dual range).
   */
  get maxValue(): number {
    return this.controlMax.value ?? this.maxNumber;
  }

  /**
   * Calcula a posição percentual da seleção (dual range).
   */
  get selectedRangeStyle(): { left: string; width: string } {
    const range = this.maxNumber - this.minNumber;
    const leftPercent = ((this.minValue - this.minNumber) / range) * 100;
    const rightPercent = ((this.maxValue - this.minNumber) / range) * 100;
    return {
      left: `${leftPercent}%`,
      width: `${rightPercent - leftPercent}%`,
    };
  }

  /**
   * Handler de blur.
   */
  onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }

  /**
   * Handler de focus.
   */
  onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  /**
   * Emite o valor do dual range.
   */
  private emitDualRangeValue(): void {
    const rangeValue: RangeValue = {
      min: this.controlMin.value ?? this.minNumber,
      max: this.controlMax.value ?? this.maxNumber,
    };
    this.onChange(rangeValue);
    this.valueChange.emit(rangeValue);
    this.cdr.markForCheck();
  }

  /**
   * Atualiza a posição visual do valor flutuante.
   */
  private updateValuePosition(): void {
    if (this.dualRange) {
      // Dual range - atualiza posições min e max
      this.updateFloatingPosition(this.valueFloatingMin, this.minValue);
      this.updateFloatingPosition(this.valueFloatingMax, this.maxValue);
    } else {
      // Modo simples
      this.updateFloatingPosition(this.valueFloating, this.value);
    }
  }

  /**
   * Atualiza a posição de um elemento flutuante específico.
   */
  private updateFloatingPosition(element: ElementRef | undefined, val: number): void {
    if (!element || !this.showValue) {
      return;
    }

    const min = this.minNumber;
    const max = this.maxNumber;
    const percentage = ((val - min) * 100) / (max - min);

    // Ajusta posição considerando o tamanho do thumb
    element.nativeElement.style.left = `calc(${percentage}% + (${10 - percentage * 0.2}px))`;
  }
}
