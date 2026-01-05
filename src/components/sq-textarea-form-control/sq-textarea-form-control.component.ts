import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { SqTooltipComponent } from '../sq-tooltip/sq-tooltip.component';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';
import { SqFormControlBaseDirective } from '../../directives/sq-form-control-base';

/**
 * Componente de textarea com Reactive Forms.
 *
 * Substitui o componente legado `sq-textarea` com integração nativa de Reactive Forms,
 * ControlValueAccessor e Validator.
 *
 * @example
 * ```html
 * <sq-textarea-form-control
 *   [label]="'Descrição'"
 *   [placeholder]="'Digite uma descrição...'"
 *   [formControl]="descriptionControl"
 * ></sq-textarea-form-control>
 * ```
 *
 * @example
 * ```html
 * <!-- Com validação required -->
 * <sq-textarea-form-control
 *   [label]="'Comentário *'"
 *   [formControl]="commentControl"
 *   sqValidation
 *   [fieldName]="'Comentário'"
 * ></sq-textarea-form-control>
 * ```
 */
@Component({
  selector: 'sq-textarea-form-control',
  templateUrl: './sq-textarea-form-control.component.html',
  styleUrls: ['./sq-textarea-form-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet, ReactiveFormsModule, SqTooltipComponent, UniversalSafePipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SqTextareaFormControlComponent),
      multi: true,
    },
  ],
})
export class SqTextareaFormControlComponent extends SqFormControlBaseDirective implements OnInit, OnDestroy {
  // ============================================================
  // Inputs - Aparência
  // ============================================================

  /**
   * Número de linhas do textarea.
   */
  @Input() rows = 4;

  /**
   * Se true, o textarea se expande automaticamente.
   */
  @Input() autoResize = false;

  /**
   * Altura mínima do textarea (quando autoResize=true).
   */
  @Input() minHeight = '100px';

  /**
   * Altura máxima do textarea (quando autoResize=true).
   */
  @Input() maxHeight = '300px';

  // ============================================================
  // Inputs - Comportamento
  // ============================================================

  /**
   * Debounce do valueChange em ms.
   */
  @Input() debounceTime = 0;


  // ============================================================
  // Templates
  // ============================================================

  /**
   * Template para label à esquerda.
   */
  @ContentChild('leftLabel') leftLabel: TemplateRef<HTMLElement> | null = null;

  /**
   * Template para label à direita.
   */
  @ContentChild('rightLabel') rightLabel: TemplateRef<HTMLElement> | null = null;

  /**
   * Template customizado para o label.
   */
  @ContentChild('labelTemplate') labelTemplate: TemplateRef<HTMLElement> | null = null;

  // ============================================================
  // Estado interno
  // ============================================================

  /**
   * Referência ao ChangeDetectorRef.
   */
  private cdr = inject(ChangeDetectorRef);

  /**
   * Referência ao ElementRef.
   */
  private elementRef = inject(ElementRef);

  /**
   * Override do watchValueChanges para adicionar debounce.
   */
  override watchValueChanges(): void {
    if (this.debounceTime > 0) {
      this.control.valueChanges
        .pipe(debounceTime(this.debounceTime), takeUntil(this.destroy$))
        .subscribe(value => {
          this.onChange(value);
          this.valueChange.emit(value);
        });
    } else {
      super.watchValueChanges();
    }
  }

  // ============================================================
  // Métodos públicos - Eventos
  // ============================================================


  /**
   * Handler para auto-resize.
   *
   * @param event - Evento de input.
   */
  onInput(event: Event): void {
    if (this.autoResize) {
      const textarea = event.target as HTMLTextAreaElement;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  // ============================================================
  // Métodos privados
  // ============================================================
}

