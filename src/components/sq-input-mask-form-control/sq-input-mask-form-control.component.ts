import { Component, Input, forwardRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { SqInputFormControlComponent } from '../sq-input-form-control/sq-input-form-control.component';
import { SqTooltipComponent } from '../sq-tooltip/sq-tooltip.component';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';

/**
 * Componente de input com máscara que estende SqInputFormControlComponent.
 * Implementa ControlValueAccessor e Validator para integração com Reactive Forms.
 * Usa a biblioteca ngx-mask para aplicar máscaras de formatação no input.
 *
 * @see {@link https://github.com/JsDaddy/ngx-mask}
 *
 * @example
 * ```html
 * <!-- Telefone -->
 * <sq-input-mask-form-control
 *   [formControl]="phoneControl"
 *   [label]="'Telefone'"
 *   [mask]="'(00) 00000-0000'"
 * ></sq-input-mask-form-control>
 *
 * <!-- CPF -->
 * <sq-input-mask-form-control
 *   [formControl]="cpfControl"
 *   [label]="'CPF'"
 *   [mask]="'000.000.000-00'"
 * ></sq-input-mask-form-control>
 *
 * <!-- Valor monetário -->
 * <sq-input-mask-form-control
 *   [formControl]="priceControl"
 *   [label]="'Preço'"
 *   [mask]="'separator.2'"
 *   [thousandSeparator]="'.'"
 *   [prefix]="'R$ '"
 * ></sq-input-mask-form-control>
 * ```
 */
@Component({
  selector: 'sq-input-mask-form-control',
  templateUrl: './sq-input-mask-form-control.component.html',
  styleUrls: ['./sq-input-mask-form-control.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgTemplateOutlet,
    ReactiveFormsModule,
    NgxMaskDirective,
    SqTooltipComponent,
    UniversalSafePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SqInputMaskFormControlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SqInputMaskFormControlComponent),
      multi: true,
    },
  ],
})
export class SqInputMaskFormControlComponent extends SqInputFormControlComponent implements OnInit {
  /**
   * The mask pattern for input validation and formatting.
   * @example '(00) 00000-0000' para telefone
   * @example '000.000.000-00' para CPF
   * @example 'separator.2' para valores monetários com 2 casas decimais
   */
  @Input() mask = '';

  /**
   * The character used as a thousand separator in numeric input.
   * @default ''
   * @example '.' para formato brasileiro (1.000,00)
   * @example ',' para formato americano (1,000.00)
   */
  @Input() thousandSeparator = '';

  /**
   * The suffix to be appended to the input value.
   * @default ''
   * @example ' kg' para peso
   * @example ' m²' para área
   */
  @Input() suffix = '';

  /**
   * The prefix to be prepended to the input value.
   * @default ''
   * @example 'R$ ' para moeda brasileira
   * @example '$ ' para dólar
   */
  @Input() prefix = '';

  /**
   * Indicates whether the mask should be visible while typing.
   * @default false
   */
  @Input() showMaskTyped = false;

  /**
   * Indicates whether negative numbers are allowed.
   * @default false
   */
  @Input() allowNegativeNumbers = false;

  /**
   * The decimal marker character or an array of characters to represent decimal values.
   * @default ['.', ',']
   */
  @Input() decimalMarker: '.' | ',' | ['.', ','] = ['.', ','];

  /**
   * The character to use as a placeholder in empty mask slots.
   * @default ''
   * @example '_' para mostrar (___) _____-____
   */
  @Input() placeHolderCharacter = '';

  /**
   * Indicates whether leading zeros should be preserved.
   * @default false
   */
  @Input() leadZero = false;

  /**
   * Defines the minimum value that can be accepted as input (for numeric masks).
   * @default undefined
   */
  @Input() minValue?: number;

  /**
   * Defines the maximum value that can be accepted as input (for numeric masks).
   * @default undefined
   */
  @Input() maxValue?: number;

  /**
   * Lifecycle hook executado após a inicialização do componente.
   * Força o tipo como 'text' para compatibilidade com máscaras.
   */
  ngOnInit(): void {
    // Força o tipo para 'text' (máscaras não funcionam bem com outros tipos)
    this.type = 'text';
  }
}

