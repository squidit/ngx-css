import {
  Directive,
  Input,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ComponentRef,
  inject,
  AfterViewInit,
  Renderer2,
  ElementRef,
  TemplateRef,
  EmbeddedViewRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SqValidationMessageComponent } from '../components/sq-validation-message/sq-validation-message.component';

/**
 * Context para template customizado de validação
 */
export interface ValidationTemplateContext {
  /**
   * Errors do controle (implicit)
   */
  $implicit: { [key: string]: any } | null;

  /**
   * O FormControl
   */
  control: any;

  /**
   * Nome do campo
   */
  fieldName: string;

  /**
   * Mensagem de erro formatada
   */
  errorMessage: string;
}

/**
 * Diretiva para gerenciar automaticamente a exibição de mensagens de validação.
 *
 * Anexa dinamicamente o componente SqValidationMessageComponent (ou um template customizado)
 * e exibe mensagens de erro baseadas no estado do FormControl associado.
 *
 * Suporta customização de mensagens, templates, e controle de quando exibir erros.
 *
 * @example
 * ```html
 * <!-- Uso básico -->
 * <input
 *   formControlName="email"
 *   sqValidation
 *   [fieldName]="'Email'"
 * />
 *
 * <!-- Com mensagens customizadas -->
 * <input
 *   formControlName="cpf"
 *   sqValidation
 *   [fieldName]="'CPF'"
 *   [customErrorMessages]="{
 *     required: 'CPF é obrigatório',
 *     cpf: 'CPF inválido'
 *   }"
 *   [showWhen]="'touchedOrDirty'"
 * />
 *
 * <!-- Com template customizado -->
 * <input
 *   formControlName="name"
 *   sqValidation
 *   [validationMessageTemplate]="customTemplate"
 * />
 * <ng-template #customTemplate let-errors let-message="errorMessage">
 *   <div class="my-error">{{ message }}</div>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[sqValidation]',
  standalone: true,
})
export class SqValidationDirective implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Nome do campo para exibição nas mensagens de erro
   */
  @Input() fieldName = '';

  /**
   * Se deve exibir ícone de erro
   */
  @Input() showValidationIcon = true;

  /**
   * Classe CSS customizada para o componente de validação
   */
  @Input() validationClass = '';

  /**
   * Mensagens de erro customizadas por tipo de erro
   * @example
   * ```typescript
   * customErrorMessages = {
   *   required: 'Este campo é obrigatório!',
   *   email: 'Por favor, insira um email válido',
   *   minlength: 'Mínimo de {requiredLength} caracteres',
   *   cpf: 'CPF inválido. Verifique os dígitos'
   * }
   * ```
   */
  @Input() customErrorMessages: Record<string, string> = {};

  /**
   * Template customizado para a mensagem de validação.
   * Se fornecido, substitui completamente o componente SqValidationMessageComponent.
   * @example
   * ```html
   * <ng-template #customValidation let-errors let-control="control" let-message="errorMessage">
   *   <div class="my-error">{{ message }}</div>
   * </ng-template>
   * ```
   */
  @Input() validationMessageTemplate?: TemplateRef<ValidationTemplateContext>;

  /**
   * Quando mostrar as validações:
   * - 'touched': Apenas após o campo ser tocado (blur)
   * - 'dirty': Após a primeira alteração no valor
   * - 'touchedOrDirty': Após tocar OU alterar (melhor UX para required)
   * - 'always': Sempre que houver erro, mesmo sem interação - PADRÃO
   * @default 'always'
   */
  @Input() showWhen: 'touched' | 'dirty' | 'touchedOrDirty' | 'always' = 'always';

  /**
   * NgControl injetado do host element
   */
  private readonly ngControl = inject(NgControl);

  /**
   * ViewContainerRef para criar componentes dinamicamente
   */
  private readonly viewContainerRef = inject(ViewContainerRef);

  /**
   * Renderer2 para manipulação segura do DOM
   */
  private readonly renderer = inject(Renderer2);

  /**
   * ElementRef do elemento host
   */
  private readonly elementRef = inject(ElementRef);

  /**
   * Subject para gerenciar unsubscribe
   */
  private readonly destroy$ = new Subject<void>();

  /**
   * Referência ao componente criado dinamicamente
   */
  private componentRef: ComponentRef<SqValidationMessageComponent> | null = null;

  /**
   * Referência ao template embutido criado dinamicamente
   */
  private templateRef: EmbeddedViewRef<ValidationTemplateContext> | null = null;

  /**
   * Elemento container para o componente/template de validação
   */
  private containerElement: HTMLElement | null = null;

  /**
   * OnInit lifecycle hook.
   * Subscribes to control status and value changes to automatically update validation display.
   */
  ngOnInit(): void {
    if (!this.ngControl || !this.ngControl.control) {
      console.warn(
        'SqValidationDirective: NgControl não encontrado. A diretiva deve ser usada com formControl ou formControlName.'
      );
      return;
    }

    // Observa mudanças no status do controle
    this.ngControl.control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateValidationMessage();
    });

    // Observa mudanças no valor do controle
    this.ngControl.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateValidationMessage();
    });
  }

  /**
   * AfterViewInit lifecycle hook.
   * Updates validation message display after the view is fully initialized.
   */
  ngAfterViewInit(): void {
    // Atualiza na inicialização
    setTimeout(() => this.updateValidationMessage(), 0);
  }

  /**
   * OnDestroy lifecycle hook.
   * Cleans up subscriptions and removes validation message component/template.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.removeValidationMessage();
  }

  /**
   * Atualiza a exibição da mensagem de validação baseado no estado do controle
   */
  private updateValidationMessage(): void {
    if (!this.ngControl.control) return;

    const shouldShow = this.shouldShowError();

    if (shouldShow) {
      this.showValidationMessage();
    } else {
      this.removeValidationMessage();
    }
  }

  /**
   * Determina se o erro deve ser exibido baseado na estratégia showWhen
   */
  private shouldShowError(): boolean {
    if (!this.ngControl.control) return false;

    const control = this.ngControl.control;

    if (!control.invalid) {
      return false;
    }

    switch (this.showWhen) {
      case 'always':
        return true;
      case 'dirty':
        return control.dirty;
      case 'touchedOrDirty':
        return control.touched || control.dirty;
      case 'touched':
      default:
        return control.touched;
    }
  }

  /**
   * Cria e exibe o componente de mensagem de validação
   */
  private showValidationMessage(): void {
    // Se já existe, apenas atualiza
    if (this.componentRef || this.templateRef) {
      this.updateComponentInputs();
      return;
    }

    // Cria o container para o componente/template
    this.containerElement = this.renderer.createElement('div');
    this.renderer.addClass(this.containerElement, 'sq-validation-container');

    // Insere o container após o elemento host
    const parentElement = this.elementRef.nativeElement.parentElement;
    if (parentElement) {
      this.renderer.appendChild(parentElement, this.containerElement);
    }

    // Usa template customizado OU componente padrão
    if (this.validationMessageTemplate) {
      this.createCustomTemplate();
    } else {
      this.createDefaultComponent();
    }
  }

  /**
   * Cria o componente padrão de validação
   */
  private createDefaultComponent(): void {
    // Cria o componente
    this.componentRef = this.viewContainerRef.createComponent(SqValidationMessageComponent);

    // Move o elemento do componente para o container
    const componentElement = this.componentRef.location.nativeElement;
    if (this.containerElement) {
      this.renderer.appendChild(this.containerElement, componentElement);
    }

    // Define os inputs do componente
    this.updateComponentInputs();

    // Marca para detecção de mudanças
    this.componentRef.changeDetectorRef.markForCheck();
    this.componentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Cria o template customizado de validação
   */
  private createCustomTemplate(): void {
    if (!this.validationMessageTemplate) return;

    const context = this.getTemplateContext();
    this.templateRef = this.viewContainerRef.createEmbeddedView(this.validationMessageTemplate, context);

    // Move os elementos do template para o container
    this.templateRef.rootNodes.forEach(node => {
      if (this.containerElement) {
        this.renderer.appendChild(this.containerElement, node);
      }
    });

    this.templateRef.detectChanges();
  }

  /**
   * Retorna o contexto para o template customizado
   */
  private getTemplateContext(): ValidationTemplateContext {
    if (!this.ngControl.control) {
      return {
        $implicit: null,
        control: null,
        fieldName: this.fieldName,
        errorMessage: '',
      };
    }

    return {
      $implicit: this.ngControl.control.errors,
      control: this.ngControl.control,
      fieldName: this.fieldName,
      errorMessage: this.getFormattedErrorMessage(),
    };
  }

  /**
   * Retorna a mensagem de erro formatada, usando customErrorMessages se disponível
   */
  private getFormattedErrorMessage(): string {
    if (!this.ngControl.control || !this.ngControl.control.errors) return '';

    const errors = this.ngControl.control.errors;
    const firstErrorKey = Object.keys(errors)[0];
    const errorValue = errors[firstErrorKey];

    // Tenta usar mensagem customizada primeiro
    if (this.customErrorMessages[firstErrorKey]) {
      return this.interpolateMessage(this.customErrorMessages[firstErrorKey], errorValue);
    }

    // Fallback para mensagens padrão do componente
    const defaultMessages: Record<string, string> = {
      required: `${this.fieldName || 'Campo'} é obrigatório`,
      email: 'Email inválido',
      minlength: `Mínimo de ${errorValue?.requiredLength || 0} caracteres`,
      maxlength: `Máximo de ${errorValue?.requiredLength || 0} caracteres`,
      pattern: 'Formato inválido',
      min: `Valor mínimo: ${errorValue?.min || 0}`,
      max: `Valor máximo: ${errorValue?.max || 0}`,
      cpf: 'CPF inválido',
      cnpj: 'CNPJ inválido',
      phone: 'Telefone inválido',
      url: 'URL inválida',
    };

    return defaultMessages[firstErrorKey] || 'Campo inválido';
  }

  /**
   * Interpola placeholders na mensagem com valores do erro
   * @example interpolateMessage('Mínimo {requiredLength} caracteres', { requiredLength: 5 })
   */
  private interpolateMessage(message: string, errorValue: any): string {
    if (!errorValue || typeof errorValue !== 'object') {
      return message;
    }

    let result = message;
    Object.keys(errorValue).forEach(key => {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), errorValue[key]);
    });

    return result;
  }

  /**
   * Atualiza os inputs do componente de validação ou contexto do template
   */
  private updateComponentInputs(): void {
    if (this.componentRef && this.ngControl.control) {
      // Atualiza componente padrão
      const instance = this.componentRef.instance;
      instance.control = this.ngControl.control;
      instance.fieldName = this.fieldName;
      instance.showIcon = this.showValidationIcon;
      instance.customClass = this.validationClass;
      // Force change detection with OnPush strategy
      this.componentRef.changeDetectorRef.markForCheck();
      this.componentRef.changeDetectorRef.detectChanges();
    } else if (this.templateRef) {
      // Atualiza contexto do template customizado
      const context = this.getTemplateContext();
      Object.assign(this.templateRef.context, context);
      this.templateRef.detectChanges();
    }
  }

  /**
   * Remove o componente de mensagem de validação
   */
  private removeValidationMessage(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }

    if (this.templateRef) {
      this.templateRef.destroy();
      this.templateRef = null;
    }

    if (this.containerElement && this.containerElement.parentElement) {
      this.renderer.removeChild(this.containerElement.parentElement, this.containerElement);
      this.containerElement = null;
    }
  }
}
