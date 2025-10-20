import {
  Component,
  Input,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  DoCheck,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Componente para exibir mensagens de validação de formulários.
 *
 * Exibe automaticamente mensagens de erro baseadas no estado do AbstractControl fornecido.
 * Suporta tradução via TranslateService (opcional).
 * Utiliza ChangeDetectionStrategy.OnPush para melhor performance.
 *
 * @example
 * ```html
 * <sq-validation-message
 *   [control]="emailControl"
 *   [fieldName]="'Email'"
 *   [showWhenTouched]="true"
 *   [showWhenDirty]="true"
 * ></sq-validation-message>
 * ```
 */
@Component({
  selector: 'sq-validation-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sq-validation-message.component.html',
  styleUrls: ['./sq-validation-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SqValidationMessageComponent implements OnInit, OnDestroy, DoCheck {
  /**
   * The FormControl or AbstractControl to validate.
   */
  @Input() control: AbstractControl | null = null;

  /**
   * Whether to only show errors when the control has been touched.
   * @default true
   */
  @Input() showWhenTouched = true;

  /**
   * Whether to show errors when the control is dirty (value changed).
   * When both showWhenTouched and showWhenDirty are true, shows when either condition is met.
   * @default false
   */
  @Input() showWhenDirty = false;

  /**
   * Custom field name for error messages.
   * If not provided, generic messages will be used.
   */
  @Input() fieldName = '';

  /**
   * Custom CSS class for the error message container.
   */
  @Input() customClass = '';

  /**
   * Whether to show the error icon.
   * @default true
   */
  @Input() showIcon = true;

  /**
   * TranslateService for i18n (optional).
   */
  public translate = inject(TranslateService, { optional: true });

  /**
   * ChangeDetectorRef for manual change detection with OnPush.
   */
  private cdr = inject(ChangeDetectorRef);

  /**
   * Subject for managing subscriptions.
   */
  private destroy$ = new Subject<void>();

  /**
   * Previous touched state to detect changes
   */
  private previousTouchedState = false;

  /**
   * Previous dirty state to detect changes
   */
  private previousDirtyState = false;

  /**
   * OnInit lifecycle hook.
   * Subscribes to control status and value changes to trigger change detection with OnPush strategy.
   */
  ngOnInit(): void {
    // Subscribe to control status changes to trigger change detection
    if (this.control) {
      merge(this.control.statusChanges || new Subject(), this.control.valueChanges || new Subject())
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.cdr.markForCheck();
        });
    }
  }

  /**
   * DoCheck lifecycle hook to detect touched and dirty state changes.
   * This is necessary because these states don't emit through statusChanges.
   * Manually triggers change detection when touched or dirty state changes.
   */
  ngDoCheck(): void {
    if (!this.control) return;

    const currentTouchedState = this.control.touched;
    const currentDirtyState = this.control.dirty;

    if (currentTouchedState !== this.previousTouchedState || currentDirtyState !== this.previousDirtyState) {
      this.previousTouchedState = currentTouchedState;
      this.previousDirtyState = currentDirtyState;
      this.cdr.markForCheck();
    }
  }

  /**
   * OnDestroy lifecycle hook.
   * Completes all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Default error messages (fallback when translation is not available).
   */
  private defaultMessages: { [key: string]: string } = {
    required: 'Este campo é obrigatório',
    email: 'Email inválido',
    emailMultiple: 'Emails inválidos: {invalidEmails}',
    phone: 'Telefone inválido',
    url: 'URL inválida',
    cpf: 'CPF inválido',
    cnpj: 'CNPJ inválido',
    minlength: 'Mínimo de {requiredLength} caracteres',
    maxlength: 'Máximo de {requiredLength} caracteres',
    min: 'Valor mínimo: {min}',
    max: 'Valor máximo: {max}',
    pattern: 'Formato inválido',
  };

  /**
   * Check if the control should show errors.
   */
  get shouldShowError(): boolean {
    if (!this.control) return false;

    const hasError = this.control.invalid && this.control.errors;

    // Se ambos são false, sempre mostra quando houver erro
    if (!this.showWhenTouched && !this.showWhenDirty) {
      return !!hasError;
    }

    // Se ambos são true, mostra quando qualquer condição for verdadeira (OR)
    if (this.showWhenTouched && this.showWhenDirty) {
      return !!(hasError && (this.control.touched || this.control.dirty));
    }

    // Se apenas showWhenTouched
    if (this.showWhenTouched) {
      return !!(hasError && this.control.touched);
    }

    // Se apenas showWhenDirty
    if (this.showWhenDirty) {
      return !!(hasError && this.control.dirty);
    }

    return false;
  }

  /**
   * Get the first error message from the control.
   */
  get errorMessage(): string {
    if (!this.control || !this.control.errors) return '';

    const errors = this.control.errors;
    const firstErrorKey = Object.keys(errors)[0];

    return this.getErrorMessage(firstErrorKey, errors[firstErrorKey]);
  }

  /**
   * Get all error messages from the control.
   */
  get errorMessages(): string[] {
    if (!this.control || !this.control.errors) return [];

    const errors = this.control.errors;
    return Object.keys(errors).map(key => this.getErrorMessage(key, errors[key]));
  }

  /**
   * Get formatted error message for a specific error.
   */
  private getErrorMessage(errorKey: string, errorValue: any): string {
    // Try to get translated message
    if (this.translate) {
      const translationKey = `forms.${errorKey}`;
      const params = this.getInterpolationParams(errorKey, errorValue);
      const translated = this.translate.instant(translationKey, params);

      // If translation exists (not the key itself), return it
      if (translated !== translationKey) {
        return translated;
      }
    }

    // Fallback to default messages
    return this.getDefaultMessage(errorKey, errorValue);
  }

  /**
   * Get default error message (no translation).
   */
  private getDefaultMessage(errorKey: string, errorValue: any): string {
    let message = this.defaultMessages[errorKey] || 'Campo inválido';

    // Replace placeholders with actual values
    if (typeof errorValue === 'object') {
      Object.keys(errorValue).forEach(key => {
        const placeholder = `{${key}}`;
        let value = errorValue[key];

        // Handle arrays (like invalidEmails)
        if (Array.isArray(value)) {
          value = value.join(', ');
        }

        message = message.replace(placeholder, value);
      });
    }

    // Add field name if provided
    if (this.fieldName && !message.includes(this.fieldName)) {
      message = `${this.fieldName}: ${message}`;
    }

    return message;
  }

  /**
   * Get interpolation parameters for translation.
   */
  private getInterpolationParams(errorKey: string, errorValue: any): any {
    if (typeof errorValue === 'object') {
      return errorValue;
    }
    return {};
  }
}
