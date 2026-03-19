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
 * O valor exibido segue o FormControl reativo: `null`, `undefined` ou string vazia permanecem vazios
 * (não há preenchimento automático com zero). Quem precisar de `0` inicial deve definir no formulário.
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
   * Quando true (padrão), o valor numérico zero (0, "0", "0,00" etc.) é tratado como vazio: não preenche o input
   * e o CVA emite `null` para o FormControl pai (necessário com máscara `separator` + ngx-mask, que senão exibe "0").
   * Use `[emptyWhenZero]="false"` quando o zero for um valor válido a mostrar e enviar.
   */
  @Input() emptyWhenZero = true;

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

    super.ngOnInit();
  }

  /**
   * ControlValueAccessor: sincroniza o valor do FormControl pai com o controle interno.
   * Com `emptyWhenZero`, evita que ngx-mask exiba "0" quando o modelo traz zero — normaliza para vazio e emite `null`.
   *
   * @param value - Valor enviado pelo Angular Forms (número, string mascarada ou null).
   */
  override writeValue(value: any): void {
    if (!this.emptyWhenZero) {
      super.writeValue(value);
      return;
    }
    if (this.isZeroLike(value)) {
      super.writeValue(null);
      queueMicrotask(() => this.onChange(null));
      return;
    }
    super.writeValue(value);
  }

  /**
   * Trata eventos de teclado para incrementar ou decrementar o valor (setas ↑ / ↓).
   *
   * @param event - Evento `keydown` do input.
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
      this.control.setValue(this.emptyWhenZero ? null : '0');
      return;
    }

    if (this.emptyWhenZero && newValue === 0) {
      this.control.setValue(null);
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

  /**
   * Indica se o valor deve ser tratado como zero “semântico” (ex.: 0, "0", "0,00") quando `emptyWhenZero` está ativo.
   *
   * @param value - Valor bruto do modelo ou do input.
   * @returns `true` se for equivalente a zero numérico; `false` para null, undefined, string vazia ou números ≠ 0.
   */
  private isZeroLike(value: any): boolean {
    if (value === null || value === undefined || value === '') {
      return false;
    }
    if (value === 0) {
      return true;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') {
        return false;
      }
      const normalized = trimmed.replace(/\./g, '').replace(/,/g, '.');
      const n = Number(normalized);
      return !Number.isNaN(n) && n === 0;
    }
    return false;
  }
}

