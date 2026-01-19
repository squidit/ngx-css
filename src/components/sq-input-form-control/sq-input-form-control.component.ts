import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  TemplateRef,
  forwardRef,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SqTooltipComponent } from '../sq-tooltip/sq-tooltip.component';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { SqFormControlBaseDirective } from '../../directives/sq-form-control-base';

/**
 * Componente de input moderno que implementa ControlValueAccessor.
 * Versão melhorada do sq-input com suporte completo a Reactive Forms.
 *
 * Usa um FormControl interno para gerenciar o valor e estado.
 * Não aplica validações internas - todas as validações devem ser definidas no FormControl externo.
 * Suporta debounce, customização de estilos, tooltips, e templates customizados.
 * Aplica automaticamente estilos de erro baseados no estado do FormControl externo.
 *
 * @example
 * ```html
 * <sq-input-form-control
 *   formControlName="email"
 *   [label]="'Email'"
 *   [type]="'email'"
 *   [placeholder]="'seu@email.com'"
 *   [tooltipMessage]="'Digite um email válido'"
 * ></sq-input-form-control>
 * ```
 */
@Component({
  selector: 'sq-input-form-control',
  templateUrl: './sq-input-form-control.component.html',
  styleUrls: ['./sq-input-form-control.component.scss'],
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, ReactiveFormsModule, SqTooltipComponent, UniversalSafePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SqInputFormControlComponent),
      multi: true,
    },
  ],
})
export class SqInputFormControlComponent extends SqFormControlBaseDirective {
  /**
   * Time in milliseconds for debouncing value changes.
   * When set to a value > 0, the value change will be debounced.
   * @default 0 (no debounce)
   */
  @Input() timeToChange = 0;

  /**
   * Type of the input element (e.g., text, email, password).
   */
  @Input() type: 'text' | 'email' | 'email-multiple' | 'hidden' | 'password' | 'tel' | 'url' | 'file' = 'text';

  /**
   * Input mode for mobile devices.
   */
  @Input() inputMode = '';

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
   * Reference to the native element.
   */
  nativeElement: ElementRef = inject(ElementRef);

  /**
   * Override the watchValueChanges method to add debounce time.
   */
  override watchValueChanges(): void {
    this.control.valueChanges
      .pipe(debounceTime(this.timeToChange ?? 0), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(value => {
        this.onChange(value);
        this.valueChange.emit(value);
      });
  }
}
