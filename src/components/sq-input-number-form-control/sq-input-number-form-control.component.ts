import { Component, Input, forwardRef, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { SqInputMaskFormControlComponent } from '../sq-input-mask-form-control/sq-input-mask-form-control.component';
import { SqTooltipComponent } from '../sq-tooltip/sq-tooltip.component';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';

/**
 * Componente de input numérico que estende SqInputMaskFormControlComponent.
 * Configura automaticamente a máscara para valores numéricos inteiros com separador de milhares.
 *
 * @example
 * ```html
 * <sq-input-number-form-control
 *   [formControl]="quantityControl"
 *   [label]="'Quantidade'"
 * ></sq-input-number-form-control>
 *
 * <!-- Com limites -->
 * <sq-input-number-form-control
 *   [formControl]="ageControl"
 *   [label]="'Idade'"
 *   [minValue]="0"
 *   [maxValue]="120"
 * ></sq-input-number-form-control>
 * ```
 */
@Component({
  selector: 'sq-input-number-form-control',
  templateUrl: '../sq-input-mask-form-control/sq-input-mask-form-control.component.html',
  styleUrls: ['./sq-input-number-form-control.component.scss'],
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
      useExisting: forwardRef(() => SqInputNumberFormControlComponent),
      multi: true,
    },
  ],
})
export class SqInputNumberFormControlComponent extends SqInputMaskFormControlComponent implements OnInit {
  /**
   * Valor de incremento/decremento ao pressionar Arrow Up/Down.
   * @default 1
   */
  @Input() incrementValue = 1;

  /**
   * Configura os valores padrão para input numérico.
   */
  override ngOnInit(): void {
    // Máscara para números inteiros com separador de milhares
    this.mask = 'separator';

    // Formato brasileiro como padrão
    if (this.thousandSeparator === '') {
      this.thousandSeparator = '.';
    }

    // Input mode numérico para dispositivos móveis
    this.inputMode = 'numeric';

    // Valor inicial 0 se não definido (pode ser sobrescrito pelo form pai)
    if (this.control.value === null || this.control.value === undefined || this.control.value === '') {
      this.control.setValue('0', { emitEvent: false });
    }

    super.ngOnInit();
  }

  /**
   * Trata eventos de teclado para incrementar/decrementar valor.
   * Usa HostListener para interceptar eventos de teclado no input.
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.incrementNumber();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.decrementNumber();
    }
  }

  /**
   * Incrementa o valor pelo incrementValue.
   */
  private incrementNumber(): void {
    const currentValue = this.getNumericValue();
    const newValue = currentValue + this.incrementValue;
    this.control.setValue(String(newValue));
  }

  /**
   * Decrementa o valor pelo incrementValue.
   */
  private decrementNumber(): void {
    const currentValue = this.getNumericValue();
    const newValue = currentValue - this.incrementValue;

    // Não permite negativos se allowNegativeNumbers for false
    if (!this.allowNegativeNumbers && newValue < 0) {
      this.control.setValue('0');
      return;
    }

    this.control.setValue(String(newValue));
  }

  /**
   * Obtém o valor numérico atual do controle.
   */
  private getNumericValue(): number {
    const value = this.control.value;
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    // Remove separadores de milhar para parsear
    const normalized = String(value).replace(/\./g, '');
    return parseInt(normalized, 10) || 0;
  }
}

