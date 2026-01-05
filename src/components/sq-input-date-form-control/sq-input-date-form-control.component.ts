import { Component, Input, forwardRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { SqInputFormControlComponent } from '../sq-input-form-control/sq-input-form-control.component';
import { SqTooltipComponent } from '../sq-tooltip/sq-tooltip.component';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';

/**
 * Componente de input de data que estende SqInputFormControlComponent.
 * Implementa ControlValueAccessor para integração com Reactive Forms.
 * Validators devem ser gerenciados externamente pelo FormControl.
 *
 * @example
 * ```html
 * <sq-input-date-form-control
 *   [formControl]="dateControl"
 *   [label]="'Data de Nascimento'"
 *   [minDate]="'1900-01-01'"
 *   [maxDate]="'2025-12-31'"
 * ></sq-input-date-form-control>
 * ```
 */
@Component({
  selector: 'sq-input-date-form-control',
  templateUrl: './sq-input-date-form-control.component.html',
  styleUrls: ['./sq-input-date-form-control.component.scss'],
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, ReactiveFormsModule, SqTooltipComponent, UniversalSafePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SqInputDateFormControlComponent),
      multi: true,
    },
  ],
})
export class SqInputDateFormControlComponent extends SqInputFormControlComponent implements OnInit {
  /**
   * Data mínima permitida no formato 'yyyy-mm-dd'
   * Usado apenas para o atributo HTML `min` do input.
   * Para validação, use validators externos no FormControl.
   */
  @Input() minDate?: string;

  /**
   * Data máxima permitida no formato 'yyyy-mm-dd'
   * Usado apenas para o atributo HTML `max` do input.
   * Para validação, use validators externos no FormControl.
   */
  @Input() maxDate?: string;

  /**
   * Placeholder padrão para inputs de data
   */
  override placeholder = 'dd/mm/aaaa';

  /**
   * Lifecycle hook executado após a inicialização do componente.
   * Define o tipo como 'date'.
   */
  override ngOnInit(): void {
    // Força o tipo para 'date'
    this.type = 'date' as any;

    // Chama o ngOnInit da classe base
    super.ngOnInit();
  }

  /**
   * Sobrescreve o método writeValue para lidar com formatos de data.
   * Converte Date ou ISO string para formato 'yyyy-mm-dd' antes de atribuir ao control.
   * @param value - Valor a ser escrito no controle
   */
  override writeValue(value: any): void {
    if (value) {
      // Converte para formato ISO se necessário
      if (value instanceof Date) {
        value = value.toISOString().split('T')[0];
      } else if (typeof value === 'string' && value.includes('T')) {
        value = value.split('T')[0];
      }
    }
    super.writeValue(value);
  }

  /**
   * Formata uma data para o formato 'yyyy-mm-dd'.
   * Aceita Date ou string como entrada e retorna string formatada ou vazio se inválido.
   * @param value - Data a ser formatada (Date ou string)
   * @returns String no formato 'yyyy-mm-dd' ou string vazia se inválido
   */
  formatDate(value: any): string {
    if (!value) return '';
    try {
      if (value instanceof Date) {
        return value.toISOString().split('T')[0];
      }
      return new Date(value).toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  /**
   * Retorna a data mínima formatada para o atributo min do input.
   * Se minDate não estiver definido, retorna '0001-01-01' (data mínima válida para HTML5).
   * @returns Data mínima no formato 'yyyy-mm-dd'
   */
  get formattedMinDate(): string {
    return this.minDate ? this.formatDate(this.minDate) : '0001-01-01';
  }

  /**
   * Retorna a data máxima formatada para o atributo max do input.
   * Se maxDate não estiver definido, retorna '9999-12-31' (data máxima válida para HTML5).
   * @returns Data máxima no formato 'yyyy-mm-dd'
   */
  get formattedMaxDate(): string {
    return this.maxDate ? this.formatDate(this.maxDate) : '9999-12-31';
  }
}
