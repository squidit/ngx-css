import {
  Directive,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  Renderer2,
  inject,
  TemplateRef,
  ViewContainerRef,
  EmbeddedViewRef,
} from '@angular/core';
import { AbstractControl, FormControlName, NgControl } from '@angular/forms';
import { Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Interface para mensagens de validação.
 * Mapeia chaves de erro (como 'required', 'email', etc.) para mensagens de erro.
 */
interface ValidationMessages {
  [key: string]: string;
}

/**
 * Contexto para template customizado de validação.
 */
export interface ValidationTemplateContext {
  /**
   * Mensagem de erro atual (implicit).
   */
  $implicit: string;

  /**
   * Mensagem de erro atual (alias).
   */
  message: string;

  /**
   * Objeto de erro completo do controle.
   */
  error: { [key: string]: any } | null;

  /**
   * Chave do erro (ex: "required", "email", "stopWord").
   */
  errorKey: string | null;

  /**
   * Valor do erro (ex: true, ou um objeto com detalhes).
   */
  errorValue: any;
}

/**
 * Diretiva para exibir mensagens de validação de formulários.
 *
 * Adiciona automaticamente a classe `is-invalid` ao elemento quando há erros
 * e exibe mensagens de erro abaixo do campo baseadas nas mensagens fornecidas.
 *
 * Funciona com `formControlName` ou `NgControl` diretamente.
 *
 * @example
 * ```html
 * <!-- Com formControlName -->
 * <sq-input-form-control
 *   formControlName="email"
 *   [validations]="{
 *     required: 'Email é obrigatório',
 *     email: 'Email inválido'
 *   }"
 * ></sq-input-form-control>
 *
 * <!-- Com NgControl -->
 * <input
 *   [formControl]="emailControl"
 *   [validations]="{
 *     required: 'Email é obrigatório',
 *     email: 'Email inválido'
 *   }"
 * />
 *
 * <!-- Com template customizado -->
 * <sq-input-form-control
 *   formControlName="email"
 *   [validations]="emailValidations"
 *   [validationTemplate]="customErrorTemplate"
 * ></sq-input-form-control>
 * <ng-template #customErrorTemplate let-message let-errorKey="errorKey" let-errorValue="errorValue">
 *   <div class="my-custom-error">
 *     <i class="fa-solid fa-exclamation-circle"></i>
 *     {{ message }}
 *     <small *ngIf="errorKey">({{ errorKey }})</small>
 *   </div>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[validations]',
  standalone: true,
})
export class SqValidationDirective implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Objeto com mensagens de validação por tipo de erro.
   * A chave deve corresponder ao nome do erro do validator.
   *
   * @example
   * ```typescript
   * validations = {
   *   required: 'Este campo é obrigatório',
   *   email: 'Email inválido',
   *   minlength: 'Mínimo de caracteres não atingido',
   *   maxlength: 'Máximo de caracteres excedido'
   * }
   * ```
   */
  @Input() validations: ValidationMessages = {};

  /**
   * Template customizado para exibir a mensagem de erro.
   * Se fornecido, substitui a exibição padrão.
   *
   * O template recebe o contexto:
   * - `let-message` ou `let-message="message"`: Mensagem de erro atual
   * - `let-error="error"`: Objeto de erro completo do controle
   * - `let-errorKey="errorKey"`: Chave do erro (ex: "required", "email", "stopWord")
   * - `let-errorValue="errorValue"`: Valor do erro (ex: true, ou um objeto com detalhes)
   *
   * @example
   * ```html
   * <ng-template #customTemplate let-message let-errorKey="errorKey" let-errorValue="errorValue">
   *   <div class="custom-error">
   *     <i class="fa-solid fa-exclamation-circle"></i>
   *     {{ message }}
   *     <small *ngIf="errorKey">({{ errorKey }})</small>
   *   </div>
   * </ng-template>
   * ```
   */
  @Input() validationTemplate?: TemplateRef<ValidationTemplateContext>;

  private destroy$ = new Subject<void>();
  private errorElement: HTMLElement | null = null;
  private templateView: EmbeddedViewRef<ValidationTemplateContext> | null = null;
  private control: AbstractControl | null = null;
  private originalMarkAsTouched: (() => void) | null = null;
  private originalMarkAsUntouched: (() => void) | null = null;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private viewContainerRef = inject(ViewContainerRef);
  private formControlName = inject(FormControlName, { optional: true, host: true });
  private ngControl = inject(NgControl, { optional: true, self: true });

  ngOnInit(): void {
    this.control = this.getControl();

    if (this.control) {
      // Intercepta markAsTouched e markAsUntouched para atualizar mensagens quando chamados programaticamente
      this.interceptMarkAsTouched();
      this.interceptMarkAsUntouched();

      this.updateInvalidClass();

      // Combina statusChanges e valueChanges em um único subscribe
      merge(this.control.statusChanges, this.control.valueChanges)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.updateInvalidClass();
          this.updateErrorMessage();
        });

      this.updateErrorMessage();
    }
  }

  ngAfterViewInit(): void {
    if (this.control) {
      // Encontra o input interno dentro do componente após a view ser inicializada
      const inputElement = this.findInputElement(this.el.nativeElement);

      if (inputElement) {
        // Escuta o evento blur no input interno
        this.renderer.listen(inputElement, 'blur', () => {
          this.handleBlur();
        });
      } else {
        // Fallback: escuta no elemento host se não encontrar o input
        this.renderer.listen(this.el.nativeElement, 'blur', () => {
          this.handleBlur();
        });
      }
    }
  }

  ngOnDestroy(): void {
    // Restaura os métodos originais antes de destruir
    this.restoreMarkAsTouched();
    this.restoreMarkAsUntouched();
    this.destroy$.next();
    this.destroy$.complete();
    this.removeErrorMessage();
  }

  /**
   * Intercepta o método markAsTouched do controle para atualizar mensagens de erro.
   */
  private interceptMarkAsTouched(): void {
    if (!this.control) {
      return;
    }

    // Salva o método original (sem bind para preservar a assinatura)
    const originalMethod = this.control.markAsTouched;
    this.originalMarkAsTouched = originalMethod.bind(this.control);

    // Substitui o método
    this.control.markAsTouched = (options?: { onlySelf?: boolean }) => {
      // Chama o método original
      originalMethod.call(this.control, options);
      // Atualiza a mensagem de erro após marcar como touched
      setTimeout(() => {
        this.updateInvalidClass();
        this.updateErrorMessage();
      }, 0);
    };
  }

  /**
   * Intercepta o método markAsUntouched do controle para atualizar mensagens de erro.
   */
  private interceptMarkAsUntouched(): void {
    if (!this.control) {
      return;
    }

    // Salva o método original (sem bind para preservar a assinatura)
    const originalMethod = this.control.markAsUntouched;
    this.originalMarkAsUntouched = originalMethod.bind(this.control);

    // Substitui o método
    this.control.markAsUntouched = (options?: { onlySelf?: boolean }) => {
      // Chama o método original
      originalMethod.call(this.control, options);
      // Atualiza a mensagem de erro após marcar como untouched
      setTimeout(() => {
        this.updateInvalidClass();
        this.updateErrorMessage();
      }, 0);
    };
  }

  /**
   * Restaura o método markAsTouched original.
   */
  private restoreMarkAsTouched(): void {
    if (this.control && this.originalMarkAsTouched) {
      this.control.markAsTouched = this.originalMarkAsTouched;
      this.originalMarkAsTouched = null;
    }
  }

  /**
   * Restaura o método markAsUntouched original.
   */
  private restoreMarkAsUntouched(): void {
    if (this.control && this.originalMarkAsUntouched) {
      this.control.markAsUntouched = this.originalMarkAsUntouched;
      this.originalMarkAsUntouched = null;
    }
  }

  /**
   * Obtém o controle do formulário associado.
   * Tenta obter via FormControlName primeiro, depois via NgControl.
   * @returns O controle do formulário ou null se não encontrado.
   */
  private getControl(): AbstractControl | null {
    if (this.formControlName && this.formControlName.control) {
      return this.formControlName.control;
    }

    if (this.ngControl && this.ngControl.control) {
      return this.ngControl.control;
    }

    return null;
  }

  /**
   * Encontra o elemento input dentro do componente.
   * Procura recursivamente por um elemento input ou textarea.
   */
  private findInputElement(element: HTMLElement): HTMLElement | null {
    // Se o próprio elemento é um input ou textarea, retorna ele
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      return element;
    }

    // Procura por input ou textarea nos filhos
    const input = element.querySelector('input, textarea');
    return input as HTMLElement | null;
  }

  /**
   * Manipula o evento blur: marca como touched e atualiza validação.
   */
  private handleBlur(): void {
    if (this.control) {
      // Marca como touched quando o campo perde o foco
      this.control.markAsTouched();
      // Atualiza imediatamente a classe e mensagem de erro após blur
      this.updateInvalidClass();
      this.updateErrorMessage();
    }
  }

  /**
   * Atualiza a classe 'is-invalid' no elemento baseado no estado de validação.
   * Adiciona a classe se o controle está inválido e foi tocado ou modificado.
   */
  private updateInvalidClass(): void {
    const hasError = this.control && this.control.invalid && (this.control.touched || this.control.dirty);

    if (hasError) {
      this.renderer.addClass(this.el.nativeElement, 'is-invalid');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'is-invalid');
    }
  }

  /**
   * Atualiza a mensagem de erro exibida.
   * Mostra a mensagem se houver erro e o controle foi tocado ou modificado.
   * Remove a mensagem se não houver erro.
   */
  private updateErrorMessage(): void {
    if (!this.control) {
      return;
    }

    const hasError = this.control.invalid && (this.control.touched || this.control.dirty);

    if (hasError) {
      const errorKey = this.getFirstErrorKey();
      if (errorKey && this.validations[errorKey]) {
        const message = this.validations[errorKey];
        const error = this.control.errors?.[errorKey] || null;
        this.showErrorMessage(message, error, errorKey);
      }
    } else {
      this.removeErrorMessage();
    }
  }

  /**
   * Obtém a primeira chave de erro do controle.
   * @returns A primeira chave de erro ou null se não houver erros.
   */
  private getFirstErrorKey(): string | null {
    if (!this.control || !this.control.errors) {
      return null;
    }

    const errorKeys = Object.keys(this.control.errors);
    return errorKeys.length > 0 ? errorKeys[0] : null;
  }

  /**
   * Exibe a mensagem de erro no DOM.
   * Usa template customizado se fornecido, caso contrário usa exibição padrão.
   * @param message - A mensagem de erro a ser exibida.
   * @param error - O objeto de erro completo do controle.
   * @param errorKey - A chave do erro (ex: 'required', 'email').
   */
  private showErrorMessage(message: string, error: any, errorKey: string | null): void {
    this.removeErrorMessage();

    const inputElement = this.el.nativeElement;
    const parent = this.renderer.parentNode(inputElement);

    if (!parent) {
      return;
    }

    // Se há template customizado, usa ele
    if (this.validationTemplate) {
      const context: ValidationTemplateContext = {
        $implicit: message,
        message: message,
        error: error,
        errorKey: errorKey,
        errorValue: error,
      };

      this.templateView = this.viewContainerRef.createEmbeddedView(this.validationTemplate, context);
      this.templateView.detectChanges();

      const wrapper = parent.classList && parent.classList.contains('price-input-wrapper') ? parent : null;

      // Move todos os rootNodes do template para o local correto
      this.templateView.rootNodes.forEach(node => {
        if (wrapper) {
          const wrapperParent = this.renderer.parentNode(wrapper);
          if (wrapperParent) {
            this.renderer.insertBefore(wrapperParent, node, this.renderer.nextSibling(wrapper));
          }
        } else {
          const nextSibling = this.renderer.nextSibling(inputElement);
          if (nextSibling) {
            this.renderer.insertBefore(parent, node, nextSibling);
          } else {
            this.renderer.appendChild(parent, node);
          }
        }
      });
    } else {
      // Exibição padrão com ícone
      this.errorElement = this.renderer.createElement('div');
      this.renderer.addClass(this.errorElement, 'invalid-feedback');

      // Ícone de alerta
      const icon = this.renderer.createElement('i');
      this.renderer.addClass(icon, 'fa-solid');
      this.renderer.addClass(icon, 'fa-triangle-exclamation');
      this.renderer.setAttribute(icon, 'aria-hidden', 'true');
      // Cor do ícone usando variável CSS do design system com fallback
      this.renderer.setStyle(icon, 'color', 'var(--color_text-icon_system_danger, rgb(130, 23, 23))');
      this.renderer.appendChild(this.errorElement, icon);

      // Espaço após o ícone
      const space = this.renderer.createText(' ');
      this.renderer.appendChild(this.errorElement, space);

      // Mensagem de erro
      const text = this.renderer.createText(message);
      this.renderer.appendChild(this.errorElement, text);

      const wrapper = parent.classList && parent.classList.contains('price-input-wrapper') ? parent : null;

      if (wrapper) {
        const wrapperParent = this.renderer.parentNode(wrapper);
        if (wrapperParent) {
          this.renderer.insertBefore(wrapperParent, this.errorElement, this.renderer.nextSibling(wrapper));
        }
      } else {
        const nextSibling = this.renderer.nextSibling(inputElement);
        if (nextSibling) {
          this.renderer.insertBefore(parent, this.errorElement, nextSibling);
        } else {
          this.renderer.appendChild(parent, this.errorElement);
        }
      }
    }
  }

  /**
   * Remove a mensagem de erro do DOM.
   * Limpa tanto o template customizado quanto o elemento de erro padrão.
   */
  private removeErrorMessage(): void {
    // Remove template view se existir
    if (this.templateView) {
      // Remove todos os rootNodes do DOM antes de destruir a view
      this.templateView.rootNodes.forEach(node => {
        if (node.parentNode) {
          this.renderer.removeChild(node.parentNode, node);
        }
      });
      this.templateView.destroy();
      this.templateView = null;
    }

    // Remove elemento de erro padrão se existir
    if (this.errorElement && this.errorElement.parentNode) {
      this.renderer.removeChild(this.errorElement.parentNode, this.errorElement);
      this.errorElement = null;
    }
  }
}
