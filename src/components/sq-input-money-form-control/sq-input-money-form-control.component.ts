import { Component, Input, forwardRef, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';
import { SqInputMaskFormControlComponent } from '../sq-input-mask-form-control/sq-input-mask-form-control.component';
import { SqTooltipComponent } from '../sq-tooltip/sq-tooltip.component';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';

/**
 * Componente de input monetário que estende SqInputMaskFormControlComponent.
 * Configura automaticamente a máscara para valores monetários e calcula
 * o prefixo da moeda baseado no código ISO 4217 (BRL, USD, EUR, etc).
 *
 * @example
 * ```html
 * <sq-input-money-form-control
 *   [formControl]="priceControl"
 *   [label]="'Preço'"
 *   [currency]="'BRL'"
 * ></sq-input-money-form-control>
 * ```
 */
@Component({
  selector: 'sq-input-money-form-control',
  templateUrl: './sq-input-money-form-control.component.html',
  styleUrls: ['./sq-input-money-form-control.component.scss'],
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, ReactiveFormsModule, NgxMaskDirective, SqTooltipComponent, UniversalSafePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SqInputMoneyFormControlComponent),
      multi: true,
    },
  ],
})
export class SqInputMoneyFormControlComponent extends SqInputMaskFormControlComponent implements OnInit, OnChanges {
  /**
   * Código da moeda no padrão ISO 4217 (BRL, USD, EUR, GBP, etc).
   * O prefixo será calculado automaticamente.
   */
  @Input() currency = 'BRL';

  /**
   * Prefixo da moeda exibido no span separado (igual ao componente legado).
   */
  currencyPrefix = '';

  /**
   * Configura os valores padrão para input monetário.
   */
  override ngOnInit(): void {
    // Máscara para valores decimais com 2 casas
    this.mask = 'separator.2';

    // Formato brasileiro como padrão (se não definido)
    if (this.thousandSeparator === '') {
      this.thousandSeparator = '.';
    }
    if (Array.isArray(this.decimalMarker)) {
      this.decimalMarker = ',';
    }

    // Configurações automáticas
    this.inputMode = 'decimal';
    this.leadZero = true;

    // Prefixo exibido em span separado (não na máscara)
    this.currencyPrefix = this.getCurrencySymbol();

    // Chama o ngOnInit da classe base primeiro
    super.ngOnInit();

    // Valor inicial 0 se não definido (pode ser sobrescrito pelo form pai)
    // Executado após super.ngOnInit() para garantir que o control está inicializado
    if (
      this.control &&
      (this.control.value === null || this.control.value === undefined || this.control.value === '')
    ) {
      this.control.setValue('0', { emitEvent: false });
    }
  }

  /**
   * Atualiza o prefixo quando a moeda muda.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currency'] && !changes['currency'].firstChange) {
      this.currencyPrefix = this.getCurrencySymbol();
    }
  }

  /**
   * Obtém o símbolo da moeda via Intl.NumberFormat.
   */
  private getCurrencySymbol(): string {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency: this.currency })
        .format(0)
        .replace(/[\d.,\s]/g, '')
        .trim();
    } catch {
      return this.currency;
    }
  }
}
