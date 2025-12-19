import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { SqTooltipComponent } from '../sq-tooltip/sq-tooltip.component';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';

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
 *   [maxLength]="500"
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
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SqTextareaFormControlComponent),
      multi: true,
    },
  ],
})
export class SqTextareaFormControlComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  // ============================================================
  // Inputs - Identificação
  // ============================================================

  /**
   * ID do elemento textarea.
   */
  @Input() id = `textarea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Nome do campo.
   */
  @Input() name = '';

  // ============================================================
  // Inputs - Aparência
  // ============================================================

  /**
   * Label do campo.
   */
  @Input() label = '';

  /**
   * Placeholder do textarea.
   */
  @Input() placeholder = '';

  /**
   * Classe CSS customizada.
   */
  @Input() customClass = '';

  /**
   * Cor de fundo do textarea.
   */
  @Input() backgroundColor = '';

  /**
   * Cor da borda do textarea.
   */
  @Input() borderColor = '';

  /**
   * Cor da label.
   */
  @Input() labelColor = '';

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
   * Desabilita o textarea.
   */
  @Input() disabled = false;

  /**
   * Modo somente leitura.
   */
  @Input() readonly = false;

  /**
   * Campo obrigatório (adiciona validação required).
   */
  @Input() required = false;

  /**
   * Comprimento máximo do texto.
   */
  @Input() maxLength: number | null = null;

  /**
   * Comprimento mínimo do texto.
   */
  @Input() minLength: number | null = null;

  /**
   * Debounce do valueChange em ms.
   */
  @Input() debounceTime = 0;

  /**
   * Exibe o span de erro.
   */
  @Input() errorSpan = true;

  /**
   * Erro externo para exibição.
   */
  @Input() externalError = '';

  /**
   * Ícone externo.
   */
  @Input() externalIcon = '';

  // ============================================================
  // Inputs - Tooltip
  // ============================================================

  /**
   * Mensagem do tooltip.
   */
  @Input() tooltipMessage = '';

  /**
   * Posição do tooltip.
   */
  @Input() tooltipPlacement: 'center top' | 'center bottom' | 'left center' | 'right center' = 'right center';

  /**
   * Cor do tooltip.
   */
  @Input() tooltipColor = 'inherit';

  /**
   * Ícone do tooltip.
   */
  @Input() tooltipIcon = '';

  // ============================================================
  // Outputs
  // ============================================================

  /**
   * Evento de tecla pressionada.
   */
  @Output() keyPressDown = new EventEmitter<KeyboardEvent>();

  /**
   * Evento de tecla solta.
   */
  @Output() keyPressUp = new EventEmitter<KeyboardEvent>();

  /**
   * Evento de foco.
   */
  @Output() focused = new EventEmitter<FocusEvent>();

  /**
   * Evento de blur.
   */
  @Output() blurred = new EventEmitter<FocusEvent>();

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
   * FormControl interno.
   */
  control = new FormControl<string>('');

  /**
   * Subject para debounce.
   */
  private valueSubject = new Subject<string>();

  /**
   * Subject para cleanup.
   */
  private destroy$ = new Subject<void>();

  /**
   * Callback de mudança de valor.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};

  /**
   * Callback de touched.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};

  /**
   * Callback de mudança de validação.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onValidationChange: () => void = () => {};

  /**
   * Referência ao ChangeDetectorRef.
   */
  private cdr = inject(ChangeDetectorRef);

  /**
   * Referência ao ElementRef.
   */
  private elementRef = inject(ElementRef);

  /**
   * Construtor do componente.
   */
  constructor() {
    // Subscription para mudança de valor com debounce opcional
    this.valueSubject
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.onChange(value);
      });
  }

  /**
   * Inicialização do componente.
   */
  ngOnInit(): void {
    this.setupValidators();

    // Subscription para mudanças do controle interno
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (this.debounceTime > 0) {
        this.valueSubject.next(value || '');
      } else {
        this.onChange(value || '');
      }
    });
  }

  /**
   * Cleanup do componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================
  // ControlValueAccessor
  // ============================================================

  /**
   * Escreve o valor no controle.
   *
   * @param value - Valor a ser escrito.
   */
  writeValue(value: string | null): void {
    this.control.setValue(value || '', { emitEvent: false });
    this.cdr.markForCheck();
  }

  /**
   * Registra callback de mudança de valor.
   *
   * @param fn - Callback.
   */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /**
   * Registra callback de touched.
   *
   * @param fn - Callback.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Define estado disabled.
   *
   * @param isDisabled - Se está desabilitado.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
    this.cdr.markForCheck();
  }

  // ============================================================
  // Validator
  // ============================================================

  /**
   * Valida o controle.
   *
   * @returns Erros de validação ou null.
   */
  validate(): ValidationErrors | null {
    return this.control.errors;
  }

  /**
   * Registra callback para mudança de validação.
   *
   * @param fn - Callback.
   */
  registerOnValidatorChange(fn: () => void): void {
    this.onValidationChange = fn;
  }

  // ============================================================
  // Getters
  // ============================================================

  /**
   * Retorna o valor atual.
   */
  get value(): string {
    return this.control.value || '';
  }

  /**
   * Retorna o número de caracteres restantes.
   */
  get remainingChars(): number {
    if (!this.maxLength) return 0;
    return this.maxLength - (this.value?.length || 0);
  }

  /**
   * Verifica se há erro.
   */
  get hasError(): boolean {
    return !!(this.externalError || (this.control.invalid && this.control.touched));
  }

  // ============================================================
  // Métodos públicos - Eventos
  // ============================================================

  /**
   * Handler de blur.
   *
   * @param event - Evento de blur.
   */
  onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }

  /**
   * Handler de focus.
   *
   * @param event - Evento de focus.
   */
  onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  /**
   * Handler de keydown.
   *
   * @param event - Evento de teclado.
   */
  onKeyDown(event: KeyboardEvent): void {
    this.keyPressDown.emit(event);
  }

  /**
   * Handler de keyup.
   *
   * @param event - Evento de teclado.
   */
  onKeyUp(event: KeyboardEvent): void {
    this.keyPressUp.emit(event);
  }

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

  /**
   * Configura os validadores baseado nos inputs.
   */
  private setupValidators(): void {
    const validators = [];

    if (this.required) {
      validators.push(Validators.required);
    }

    if (this.maxLength) {
      validators.push(Validators.maxLength(this.maxLength));
    }

    if (this.minLength) {
      validators.push(Validators.minLength(this.minLength));
    }

    if (validators.length > 0) {
      this.control.setValidators(validators);
      this.control.updateValueAndValidity({ emitEvent: false });
    }
  }
}

