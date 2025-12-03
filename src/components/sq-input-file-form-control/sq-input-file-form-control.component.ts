import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  forwardRef,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Optional,
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
import { TranslateService } from '@ngx-translate/core';
import { SqLoaderComponent } from '../sq-loader/sq-loader.component';
import { UniversalSafePipe } from '../../pipes/universal-safe/universal-safe.pipe';
import { FileValidators } from '../../validators/file.validators';
import { Subject, takeUntil } from 'rxjs';

/**
 * Componente de input file moderno que implementa ControlValueAccessor e Validator.
 * Versão melhorada do sq-input-file com suporte completo a Reactive Forms.
 *
 * Usa um FormControl interno para gerenciar o valor e estado.
 * Suporta upload de arquivos únicos ou múltiplos, validação de tamanho e tipos de arquivo.
 * Permite customização de estilos, loading state, e templates customizados.
 *
 * Mantém compatibilidade visual e comportamental com o componente legado sq-input-file,
 * mas adiciona suporte completo a Reactive Forms e validações mais robustas.
 *
 * @example
 * ```html
 * <sq-input-file-form-control
 *   [formControl]="fileControl"
 *   [label]="'Upload de Documento'"
 *   [placeholder]="'Selecione um arquivo'"
 *   [maxSize]="5242880"
 *   [fileType]="'.pdf,.doc,.docx'"
 * ></sq-input-file-form-control>
 * ```
 */
@Component({
  selector: 'sq-input-file-form-control',
  templateUrl: './sq-input-file-form-control.component.html',
  styleUrls: ['./sq-input-file-form-control.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle, NgTemplateOutlet, ReactiveFormsModule, SqLoaderComponent, UniversalSafePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SqInputFileFormControlComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SqInputFileFormControlComponent),
      multi: true,
    },
  ],
})
export class SqInputFileFormControlComponent implements ControlValueAccessor, Validator, OnChanges, OnDestroy {
  /**
   * The name attribute for the input element.
   *
   * @default 'random-name-[hash-random-code]'
   */
  @Input() name = `random-name-${(1 + Date.now() + Math.random()).toString().replace('.', '')}`;

  /**
   * The id attribute for the input element.
   */
  @Input() id?: string;

  /**
   * An optional label for the input.
   */
  @Input() label?: string;

  /**
   * Custom CSS class for the input element.
   */
  @Input() customClass = '';

  /**
   * Placeholder text for the file input button.
   */
  @Input() placeholder = 'Escolher arquivo';

  /**
   * Flag to make the input element readonly.
   */
  @Input() readonly = false;

  /**
   * Text color for the file input button.
   */
  @Input() textColor = 'var(--white-html)';

  /**
   * Border color for the file input button.
   */
  @Input() borderColor = 'var(--primary_color)';

  /**
   * Background color for the file input button.
   */
  @Input() color = 'var(--primary_color)';

  /**
   * Font size for the file input button.
   */
  @Input() fontSize = '1rem';

  /**
   * Maximum allowed file size in bytes.
   * Example: 5242880 = 5MB
   */
  @Input() maxSize?: number;

  /**
   * Indicates whether the file input is in a loading state.
   */
  @Input() loading = false;

  /**
   * Flag to display an error span.
   */
  @Input() errorSpan = true;

  /**
   * Flag to use form errors for validation messages (translation).
   */
  @Input() useFormErrors = true;

  /**
   * Allowed file types pattern (e.g., '.jpg,.png' or 'image/*').
   */
  @Input() fileType = '*.*';

  /**
   * Indicates whether multiple files can be selected.
   */
  @Input() multiple = false;

  /**
   * Indicates whether padding should be removed from the file input button.
   */
  @Input() noPadding = false;

  /**
   * Display the file input as a block element.
   */
  @Input() block = false;

  /**
   * Custom content template to be displayed within the file input button.
   */
  @ContentChild('customContent', { static: true })
  customContent: TemplateRef<HTMLElement> | null = null;

  /**
   * Event emitter for when files are selected.
   */
  @Output() filesSelected: EventEmitter<FileList | File[]> = new EventEmitter();

  /**
   * Event emitter for validation errors (e.g., file size exceeded).
   */
  @Output() validationError: EventEmitter<string> = new EventEmitter();

  /**
   * Internal FormControl for managing the file list value and state.
   */
  control = new FormControl<FileList | File[] | null>(null);

  /**
   * Reference to the native element.
   */
  nativeElement: ElementRef = inject(ElementRef);

  /**
   * Change detector reference for manual change detection.
   */
  private cdr = inject(ChangeDetectorRef);

  /**
   * TranslateService for error message translation (optional).
   */
  private translate?: TranslateService;

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
  private onTouched: () => void = () => {};

  /**
   * External validator function (propagated from parent control).
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onValidationChange: () => void = () => {};

  /**
   * Indicates whether the control is disabled.
   */
  get disabled(): boolean {
    return this.control.disabled;
  }

  /**
   * Gets the current error message to display.
   * Returns a formatted error message based on the control's errors.
   * Usa as mesmas chaves de tradução do componente legado para consistência.
   */
  get errorMessage(): string {
    if (!this.control.errors || !this.control.touched) {
      return '';
    }

    const errors = this.control.errors;

    // Check for specific error types and return appropriate message
    // Usa as mesmas chaves de tradução do componente legado
    if (errors['required']) {
      return this.getTranslatedError('forms.required');
    }

    if (errors['maxSize']) {
      // Usa a mesma chave de tradução do componente legado
      return this.getTranslatedError('forms.fileSize');
    }

    if (errors['fileType']) {
      return this.getTranslatedError('forms.fileType');
    }

    // Return generic error message
    return this.getTranslatedError('forms.error');
  }

  /**
   * Gets translated error message or returns the key if translation not available.
   * @param errorKey - The error key to translate
   * @returns Translated message or the key itself
   */
  private getTranslatedError(errorKey: string): string {
    if (this.useFormErrors && this.translate) {
      // Translate.instant() é síncrono quando a tradução já está carregada
      return this.translate.instant(errorKey);
    }
    return errorKey;
  }

  /**
   * Constructor that initializes the component.
   * Sets up value change subscriptions.
   * @param translateService - Optional TranslateService for i18n
   */
  constructor(@Optional() translateService?: TranslateService) {
    this.translate = translateService;
    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.onChange(value);
      this.filesSelected.emit(value || []);
    });

    this.control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  /**
   * Lifecycle hook called on component changes.
   * Updates the control state based on input property changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Handle readonly state changes
    if (changes['readonly']) {
      if (changes['readonly'].currentValue) {
        this.control.disable({ emitEvent: false });
      } else if (!this.disabled) {
        this.control.enable({ emitEvent: false });
      }
    }

    // Handle loading state changes
    if (changes['loading']) {
      if (changes['loading'].currentValue) {
        this.control.disable({ emitEvent: false });
      } else if (!this.readonly) {
        this.control.enable({ emitEvent: false });
      }
    }

    // Update validators when maxSize or fileType changes (including first change)
    if (changes['maxSize'] || changes['fileType']) {
      this.updateFileValidators();
    }
  }

  /**
   * Lifecycle hook called on component destruction.
   * Completes the destroy subject to clean up subscriptions.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================
  // ControlValueAccessor Implementation
  // ============================================

  /**
   * Writes a new value to the control.
   * Implements ControlValueAccessor interface.
   *
   * @param value - The new value for the control
   */
  writeValue(value: any): void {
    // File inputs typically don't receive values programmatically due to security restrictions
    // But we can handle null/undefined to clear the control
    if (value === null || value === undefined) {
      this.control.setValue(null, { emitEvent: false });
      this.cdr.markForCheck();
    }
  }

  /**
   * Registers a callback function to be called when the value changes.
   * Implements ControlValueAccessor interface.
   *
   * @param fn - The callback function
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function to be called when the control is touched.
   * Implements ControlValueAccessor interface.
   *
   * @param fn - The callback function
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of the control.
   * Implements ControlValueAccessor interface.
   *
   * @param isDisabled - Whether the control should be disabled
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable({ emitEvent: false });
    } else {
      this.control.enable({ emitEvent: false });
    }
    this.cdr.markForCheck();
  }

  // ============================================
  // Validator Implementation
  // ============================================

  /**
   * Atualiza os validators do FormControl com base nos inputs.
   * Preserva os validators existentes e adiciona os novos automaticamente.
   * Segue o mesmo padrão do sq-input-date-form-control.
   */
  private updateFileValidators(): void {
    if (!this.control) return;

    // Coleta os validators existentes
    const existingValidators = this.control.validator ? [this.control.validator] : [];

    // Adiciona novos validators baseados nos inputs
    const newValidators = [];

    // Adiciona validator de tamanho máximo se o @Input foi fornecido
    if (this.maxSize) {
      newValidators.push(FileValidators.maxFileSize(this.maxSize));
    }

    // Adiciona validator de tipo de arquivo se o @Input foi fornecido
    // Converte o formato do accept (ex: '.pdf,.doc,.docx' ou 'image/*') para array
    if (this.fileType && this.fileType !== '*.*') {
      const allowedTypes = this.parseFileTypes(this.fileType);
      if (allowedTypes.length > 0) {
        newValidators.push(FileValidators.fileType(allowedTypes));
      }
    }

    // Combina validators existentes + novos automáticos
    this.control.setValidators([...existingValidators, ...newValidators]);
    this.control.updateValueAndValidity({ emitEvent: false });

    // Notify parent control that validators changed
    this.onValidationChange();
  }

  /**
   * Converte o formato de fileType (accept attribute) para array de extensões.
   * @param fileType - String no formato '.pdf,.doc' ou 'image/*'
   * @returns Array de extensões permitidas
   */
  private parseFileTypes(fileType: string): string[] {
    // Se for wildcard como 'image/*', não valida por extensão
    if (fileType.includes('/*')) {
      return [];
    }

    // Split por vírgula e limpa espaços
    return fileType
      .split(',')
      .map(type => type.trim().toLowerCase())
      .filter(type => type.startsWith('.'));
  }

  /**
   * Performs validation on the control.
   * Implements Validator interface.
   * Apenas propaga os erros do control interno (padrão dos form-control components).
   *
   * @returns Validation errors or null if valid
   */
  validate(): ValidationErrors | null {
    // Emite evento de erro se houver erro de tamanho
    if (this.control.errors?.['maxSize']) {
      this.validationError.emit(this.control.errors['maxSize'].message);
    }

    // The component doesn't have custom validation logic
    // It propagates the internal control's validation state
    return this.control.errors;
  }

  /**
   * Registers a callback to be called when validation status changes.
   * Implements Validator interface.
   *
   * @param fn - The callback function
   */
  registerOnValidatorChange(fn: () => void): void {
    this.onValidationChange = fn;
  }

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * Handles file input change events.
   *
   * @param event - The input change event
   */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      this.control.setValue(files);
      this.control.markAsTouched();
      this.onTouched();
    }
  }

  /**
   * Handles the click event on the file input to clear previous value.
   * This allows selecting the same file again.
   *
   * @param event - The click event
   * @param inputElement - The input element reference
   */
  onInputClick(event: Event, inputElement: HTMLInputElement): void {
    inputElement.value = '';
  }
}
