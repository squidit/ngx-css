import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SqInputComponent } from '../../../../../src/components/sq-input/sq-input.component';
import { SqInputFormControlComponent } from '../../../../../src/components/sq-input-form-control/sq-input-form-control.component';
import { SqValidationMessageComponent } from '../../../../../src/components/sq-validation-message/sq-validation-message.component';
import { SqValidationDirective } from '../../../../../src/directives/sq-validation.directive';
import { InputValidators } from '../../../../../src/validators/input.validators';
import { CodeTabsComponent, CodeExample } from '../code-tabs/code-tabs.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-input-comparison-example',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SqInputComponent,
    SqInputFormControlComponent,
    SqValidationMessageComponent,
    SqValidationDirective,
    CodeTabsComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './input-comparison-example.component.html',
  styleUrls: ['./input-comparison-example.component.scss'],
})
export class InputComparisonExampleComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', route: '/components-index', icon: 'fas fa-home' },
    { label: 'Comparação de Inputs', icon: 'fas fa-keyboard' },
  ];
  // ============================================
  // SEÇÃO 1: Comparação Básica
  // ============================================
  // sq-input (antigo - two-way binding)
  oldInputValue = '';

  // sq-input-form-control (novo - FormControl)
  newInputControl = new FormControl('');

  // ============================================
  // SEÇÃO 2: Validações por Tipo
  // ============================================
  // Email
  oldEmailValue = '';
  newEmailControl = new FormControl('', [Validators.required]);

  // Telefone
  oldPhoneValue = '';
  newPhoneControl = new FormControl('', [Validators.required]);

  // URL
  oldUrlValue = '';
  newUrlControl = new FormControl('', [Validators.required]);

  // Email Múltiplo
  oldEmailMultipleValue = '';
  newEmailMultipleControl = new FormControl('', [Validators.required]);

  // ============================================
  // SEÇÃO 3: Validações Brasileiras (CPF/CNPJ)
  // ============================================
  cpfControl = new FormControl('', [Validators.required, InputValidators.cpf()]);
  cnpjControl = new FormControl('', [Validators.required, InputValidators.cnpj()]);

  // ============================================
  // SEÇÃO 4: Formulário Completo - Antigo
  // ============================================
  oldFormData = {
    name: '',
    email: '',
    phone: '',
    message: '',
  };

  oldFormValid = false;

  // ============================================
  // SEÇÃO 5: Formulário Completo - Novo
  // ============================================
  newForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  // ============================================
  // SEÇÃO 6: Estados e Customizações
  // ============================================
  disabledControl = new FormControl({ value: 'Campo desabilitado', disabled: true });
  readonlyValue = 'Campo somente leitura';
  maxLengthControl = new FormControl('', [Validators.maxLength(50)]);

  // ============================================
  // SEÇÃO 7: Debounce / timeToChange
  // ============================================
  searchOldValue = '';
  searchNewControl = new FormControl('');
  searchResults: string[] = [];

  // ============================================
  // SEÇÃO 8: Validação Customizada
  // ============================================
  usernameControl = new FormControl('', [Validators.required, Validators.minLength(3), this.usernameValidator]);

  passwordControl = new FormControl('', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]);

  // ============================================
  // SEÇÃO 9: Diretiva sqValidation
  // ============================================
  directiveEmailControl = new FormControl('', [Validators.required, Validators.email]);
  directiveCpfControl = new FormControl('', [Validators.required, InputValidators.cpf()]);
  directivePasswordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  // Mensagens customizadas
  customMessages = {
    required: '⚠️ Este campo não pode ficar vazio!',
    email: '📧 Por favor, insira um email válido (exemplo: nome@empresa.com)',
    minlength: '📏 Você precisa de pelo menos {requiredLength} caracteres',
  };

  // ============================================
  // MÉTODOS
  // ============================================

  /**
   * Validador customizado para username
   */
  usernameValidator(control: FormControl): { [key: string]: any } | null {
    if (!control.value) return null;

    const value = control.value;
    const hasSpace = value.includes(' ');
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (hasSpace) return { hasSpace: true };
    if (hasSpecialChar) return { hasSpecialChar: true };

    return null;
  }

  /**
   * Validador customizado para força da senha
   */
  passwordStrengthValidator(control: FormControl): { [key: string]: any } | null {
    if (!control.value) return null;

    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const strength = (hasUpperCase ? 1 : 0) + (hasLowerCase ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecialChar ? 1 : 0);

    if (strength < 3) {
      return { weakPassword: { strength } };
    }

    return null;
  }

  /**
   * Handler para mudanças no campo antigo
   */
  onOldInputChange(value: any) {
    console.log('Old input changed:', value);
  }

  /**
   * Handler para status de validação do campo antigo
   */
  onOldValidChange(valid: boolean) {
    this.oldFormValid = valid;
  }

  /**
   * Submit do formulário antigo
   */
  onOldFormSubmit() {
    if (this.oldFormValid) {
      console.log('Old form submitted:', this.oldFormData);
      alert('Formulário antigo enviado! Veja o console.');
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }

  /**
   * Submit do formulário novo
   */
  onNewFormSubmit() {
    if (this.newForm.valid) {
      console.log('New form submitted:', this.newForm.value);
      alert('Formulário novo enviado! Veja o console.');
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
      this.markFormGroupTouched(this.newForm);
    }
  }

  /**
   * Marca todos os campos como touched
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Simula busca com debounce
   */
  onSearchChange(value: string) {
    console.log('Searching for:', value);
    // Simula resultados de busca
    this.searchResults = value
      ? ['Resultado 1 para ' + value, 'Resultado 2 para ' + value, 'Resultado 3 para ' + value]
      : [];
  }

  /**
   * Reseta o formulário novo
   */
  resetNewForm() {
    this.newForm.reset();
  }

  /**
   * Reseta o formulário antigo
   */
  resetOldForm() {
    this.oldFormData = {
      name: '',
      email: '',
      phone: '',
      message: '',
    };
  }

  /**
   * Preenche o formulário novo com dados de exemplo
   */
  fillNewForm() {
    this.newForm.patchValue({
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      phone: '11987654321',
      message: 'Esta é uma mensagem de exemplo para testar o formulário.',
    });
  }

  /**
   * Preenche o formulário antigo com dados de exemplo
   */
  fillOldForm() {
    this.oldFormData = {
      name: 'Maria Santos',
      email: 'maria.santos@exemplo.com',
      phone: '11987654321',
      message: 'Esta é uma mensagem de exemplo para testar o formulário antigo.',
    };
  }

  /**
   * Verifica se um campo é inválido e foi tocado
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.newForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Retorna a mensagem de erro para um campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.newForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) return 'Campo obrigatório';
    if (errors['email']) return 'Email inválido';
    if (errors['phone']) return 'Telefone inválido';
    if (errors['url']) return 'URL inválida';
    if (errors['minlength']) {
      return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;
    }

    return 'Campo inválido';
  }

  /**
   * Retorna mensagem de erro para username
   */
  getUsernameErrorMessage(): string {
    if (!this.usernameControl.errors) return '';

    if (this.usernameControl.errors['required']) return 'Username é obrigatório';
    if (this.usernameControl.errors['minlength']) return 'Username deve ter no mínimo 3 caracteres';
    if (this.usernameControl.errors['hasSpace']) return 'Username não pode ter espaços';
    if (this.usernameControl.errors['hasSpecialChar']) return 'Username não pode ter caracteres especiais';

    return '';
  }

  /**
   * Retorna mensagem de erro para senha
   */
  getPasswordErrorMessage(): string {
    if (!this.passwordControl.errors) return '';

    if (this.passwordControl.errors['required']) return 'Senha é obrigatória';
    if (this.passwordControl.errors['minlength']) return 'Senha deve ter no mínimo 8 caracteres';
    if (this.passwordControl.errors['weakPassword']) {
      return 'Senha fraca. Use letras maiúsculas, minúsculas, números e caracteres especiais.';
    }

    return '';
  }

  /**
   * Retorna a força da senha em porcentagem
   */
  getPasswordStrength(): number {
    if (!this.passwordControl.value) return 0;

    const value = this.passwordControl.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinLength = value.length >= 8;

    const criteria =
      (hasUpperCase ? 1 : 0) +
      (hasLowerCase ? 1 : 0) +
      (hasNumber ? 1 : 0) +
      (hasSpecialChar ? 1 : 0) +
      (hasMinLength ? 1 : 0);

    return (criteria / 5) * 100;
  }

  /**
   * Retorna a cor da barra de força da senha
   */
  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return '#dc3545'; // red
    if (strength < 70) return '#ffc107'; // yellow
    return '#28a745'; // green
  }

  // ============================================
  // CODE EXAMPLES
  // ============================================

  basicExampleCode: CodeExample[] = [
    {
      label: 'Antigo (sq-input)',
      language: 'html',
      code: `<!-- Componente Antigo - Template-driven Forms -->
<sq-input
  [(value)]="emailValue"
  [type]="'email'"
  [label]="'Email'"
  [placeholder]="'seu@email.com'"
  [required]="true"
  (valueChange)="onEmailChange($event)"
></sq-input>

<!-- Validação interna hardcoded no componente -->`,
    },
    {
      label: 'Novo (sq-input-form-control)',
      language: 'html',
      code: `<!-- Componente Novo - Reactive Forms -->
<sq-input-form-control
  [formControl]="emailControl"
  [type]="'email'"
  [label]="'Email'"
  [placeholder]="'seu@email.com'"
></sq-input-form-control>

<!-- Validators aplicados via FormControl! -->`,
    },
    {
      label: 'TypeScript (Antigo)',
      language: 'typescript',
      code: `// Abordagem Antiga - Two-way binding
emailValue = '';

onEmailChange(value: string) {
  console.log('Email:', value);
  // Validação interna do componente
  // Sem controle sobre validadores
}`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `import { FormControl, Validators } from '@angular/forms';

// Abordagem Nova - Reactive Forms
emailControl = new FormControl('', [
  Validators.required,
  Validators.email // ou InputValidators.email()
]);

// Controle total sobre validações!
// type="email" aplica validators automaticamente`,
    },
  ];

  validationExampleCode: CodeExample[] = [
    {
      label: 'Antigo (HTML)',
      language: 'html',
      code: `<!-- Componente Antigo - Validação Interna -->
<sq-input
  [(value)]="emailValue"
  [type]="'email'"
  [label]="'Email'"
  [required]="true"
  [errorSpan]="true"
></sq-input>

<!-- Validação acontece DENTRO do componente -->
<!-- Sem controle externo sobre quando/como validar -->`,
    },
    {
      label: 'Novo (HTML)',
      language: 'html',
      code: `<!-- Componente Novo - Validação Externa -->
<sq-input-form-control
  [formControl]="emailControl"
  [type]="'email'"
  [label]="'Email'"
></sq-input-form-control>

<!-- Componente de validação SEPARADO -->
<sq-validation-message
  [control]="emailControl"
  [fieldName]="'Email'"
></sq-validation-message>

<!-- Total controle sobre validação! -->`,
    },
    {
      label: 'Antigo (TypeScript)',
      language: 'typescript',
      code: `// Abordagem Antiga
emailValue = '';

// Validação hardcoded no componente
// required=true, type="email"
// Sem acesso aos erros programaticamente
// Sem controle sobre quando validar`,
    },
    {
      label: 'Novo (TypeScript)',
      language: 'typescript',
      code: `import { FormControl, Validators } from '@angular/forms';
import { InputValidators } from '@squidit/ngx-css';

// Abordagem Nova - Total Controle
emailControl = new FormControl('', [
  Validators.required,
  InputValidators.email()
]);

// Acesso programático aos erros
if (emailControl.hasError('email')) {
  console.log('Email inválido!');
}

// Controle quando validar
emailControl.markAsTouched();`,
    },
  ];

  customValidatorExampleCode: CodeExample[] = [
    {
      label: 'Antigo (Impossível)',
      language: 'html',
      code: `<!-- Componente Antigo - SEM suporte a CPF/CNPJ -->
<sq-input
  [(value)]="cpfValue"
  [label]="'CPF'"
  [placeholder]="'000.000.000-00'"
></sq-input>

<!-- ❌ PROBLEMA: Não valida CPF -->
<!-- ❌ Precisa criar validação customizada externa -->
<!-- ❌ Validações são hardcoded no componente -->`,
    },
    {
      label: 'Novo (Possível)',
      language: 'html',
      code: `<!-- Componente Novo - CPF/CNPJ nativos! -->
<sq-input-form-control
  [formControl]="cpfControl"
  [label]="'CPF'"
  [placeholder]="'000.000.000-00'"
></sq-input-form-control>

<sq-validation-message
  [control]="cpfControl"
  [fieldName]="'CPF'"
></sq-validation-message>

<!-- ✅ Validação de CPF automática! -->
<!-- ✅ Validação reutiliza ValidatorHelper -->`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `import { FormControl, Validators } from '@angular/forms';
import { InputValidators } from '@squidit/ngx-css';

// CPF com validação nativa
cpfControl = new FormControl('', [
  Validators.required,
  InputValidators.cpf() // ✅ Reutiliza ValidatorHelper.cpf()
]);

// CNPJ com validação nativa
cnpjControl = new FormControl('', [
  Validators.required,
  InputValidators.cnpj() // ✅ Reutiliza ValidatorHelper.cnpj()
]);

// Verificar se é válido
console.log(cpfControl.valid); // true/false
console.log(cpfControl.hasError('cpf')); // true se inválido`,
    },
  ];

  oldFormExampleCode: CodeExample[] = [
    {
      label: 'HTML (Antigo)',
      language: 'html',
      code: `<!-- Formulário Antigo - Template-driven Forms -->
<form (ngSubmit)="onOldFormSubmit()">
  <sq-input
    [(value)]="oldFormData.name"
    [label]="'Nome Completo'"
    [placeholder]="'Digite seu nome'"
    [required]="true"
  ></sq-input>
  
  <sq-input
    [(value)]="oldFormData.email"
    [type]="'email'"
    [label]="'Email'"
    [placeholder]="'seu@email.com'"
    [required]="true"
  ></sq-input>
  
  <sq-input
    [(value)]="oldFormData.phone"
    [type]="'tel'"
    [label]="'Telefone'"
    [required]="true"
  ></sq-input>
  
  <button type="submit">Enviar</button>
</form>

<!-- ❌ Two-way binding para cada campo -->
<!-- ❌ Validação interna não controlável -->
<!-- ❌ Difícil resetar todos os campos -->`,
    },
    {
      label: 'TypeScript (Antigo)',
      language: 'typescript',
      code: `// Abordagem Antiga - Objeto com dados
oldFormData = {
  name: '',
  email: '',
  phone: '',
  message: ''
};

onOldFormSubmit() {
  // Precisa validar manualmente
  if (this.oldFormData.name && this.oldFormData.email) {
    console.log('Form data:', this.oldFormData);
  }
}

// ❌ Sem controle de validação
// ❌ Sem status do formulário (valid/invalid)
// ❌ Difícil resetar: precisa limpar cada campo
resetOldForm() {
  this.oldFormData = { name: '', email: '', phone: '', message: '' };
}`,
    },
  ];

  formGroupExampleCode: CodeExample[] = [
    {
      label: 'Antigo (Template-driven)',
      language: 'html',
      code: `<!-- Componente Antigo - Template-driven Forms -->
<form #userForm="ngForm" (ngSubmit)="onSubmit()">
  <sq-input
    [(value)]="user.name"
    [label]="'Nome Completo'"
    [required]="true"
    name="name"
  ></sq-input>
  
  <sq-input
    [(value)]="user.email"
    [type]="'email'"
    [label]="'Email'"
    [required]="true"
    name="email"
  ></sq-input>
  
  <button type="submit" [disabled]="!userForm.valid">
    Enviar
  </button>
</form>

<!-- ❌ Validação assíncrona difícil -->
<!-- ❌ Testes mais complexos -->`,
    },
    {
      label: 'Novo (Reactive Forms)',
      language: 'html',
      code: `<!-- Componente Novo - Reactive Forms -->
<form [formGroup]="newForm" (ngSubmit)="onNewFormSubmit()">
  <sq-input-form-control
    formControlName="name"
    [label]="'Nome Completo'"
  ></sq-input-form-control>
  <sq-validation-message
    [control]="newForm.get('name')"
    [fieldName]="'Nome'"
  ></sq-validation-message>
  
  <sq-input-form-control
    formControlName="email"
    [type]="'email'"
    [label]="'Email'"
  ></sq-input-form-control>
  <sq-validation-message
    [control]="newForm.get('email')"
    [fieldName]="'Email'"
  ></sq-validation-message>
  
  <button type="submit" [disabled]="newForm.invalid">
    Enviar
  </button>
</form>

<!-- ✅ Validação assíncrona fácil -->
<!-- ✅ Testes simples e diretos -->
<!-- ✅ Total controle sobre status -->`,
    },
    {
      label: 'Antigo (TypeScript)',
      language: 'typescript',
      code: `// Abordagem Antiga
user = {
  name: '',
  email: ''
};

onSubmit() {
  console.log(this.user);
  
  // ❌ Difícil adicionar validações dinâmicas
  // ❌ Difícil resetar formulário
  // ❌ Difícil testar
  // ❌ Sem controle de touched/dirty
}`,
    },
    {
      label: 'Novo (TypeScript)',
      language: 'typescript',
      code: `import { FormGroup, FormControl, Validators } from '@angular/forms';

// Abordagem Nova - Reactive Forms
newForm = new FormGroup({
  name: new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]),
  email: new FormControl('', [
    Validators.required,
    Validators.email
  ]),
  phone: new FormControl('', [Validators.required]),
  message: new FormControl('', [
    Validators.required,
    Validators.minLength(10)
  ])
});

onNewFormSubmit() {
  if (this.newForm.valid) {
    console.log(this.newForm.value);
    // { name: '...', email: '...', phone: '...', message: '...' }
  }
}

// ✅ Fácil resetar: this.newForm.reset()
// ✅ Fácil preencher: this.newForm.patchValue({...})
// ✅ Total controle: this.newForm.get('name').enable()
// ✅ Status: this.newForm.valid, touched, dirty, etc`,
    },
  ];

  statesExampleCode: CodeExample[] = [
    {
      label: 'Antigo (HTML)',
      language: 'html',
      code: `<!-- Componente Antigo - Estados -->
<sq-input
  [(value)]="disabledValue"
  [label]="'Desabilitado'"
  [disabled]="true"
></sq-input>

<sq-input
  [(value)]="readonlyValue"
  [label]="'Readonly'"
  [readonly]="true"
></sq-input>

<sq-input
  [(value)]="maxLengthValue"
  [label]="'Com Limite'"
  [maxLength]="50"
></sq-input>`,
    },
    {
      label: 'Novo (HTML)',
      language: 'html',
      code: `<!-- Componente Novo - Estados com FormControl -->
<sq-input-form-control
  [formControl]="disabledControl"
  [label]="'Desabilitado'"
></sq-input-form-control>

<sq-input-form-control
  [formControl]="readonlyControl"
  [label]="'Readonly'"
  [readonly]="true"
></sq-input-form-control>

<sq-input-form-control
  [formControl]="maxLengthControl"
  [label]="'Com Limite'"
  [maxLength]="50"
></sq-input-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `// Controle de estados via FormControl
disabledControl = new FormControl({ value: 'Não editável', disabled: true });
readonlyControl = new FormControl('Somente leitura');
maxLengthControl = new FormControl('');

// Habilitar/Desabilitar dinamicamente
disabledControl.enable();
disabledControl.disable();

// Verificar estado
console.log(disabledControl.disabled); // true/false`,
    },
  ];

  debounceExampleCode: CodeExample[] = [
    {
      label: 'Antigo (Impossível)',
      language: 'html',
      code: `<!-- Componente Antigo - Sem debounce nativo -->
<sq-input
  [(value)]="searchValue"
  [label]="'Busca'"
  (valueChange)="onSearch($event)"
></sq-input>

<!-- ❌ Precisa implementar debounce manualmente -->`,
    },
    {
      label: 'Novo (Fácil)',
      language: 'html',
      code: `<!-- Componente Novo - Debounce configurável -->
<sq-input-form-control
  [formControl]="searchControl"
  [label]="'Busca'"
  [timeToChange]="500"
></sq-input-form-control>

<!-- ✅ Debounce de 500ms automático! -->`,
    },
    {
      label: 'TypeScript (Antigo)',
      language: 'typescript',
      code: `// Implementação manual de debounce
searchValue = '';
private searchTimeout: any;

onSearch(value: string) {
  clearTimeout(this.searchTimeout);
  this.searchTimeout = setTimeout(() => {
    this.doSearch(value);
  }, 500);
}

// ❌ Código repetitivo
// ❌ Precisa gerenciar timeouts manualmente`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

// Debounce automático via RxJS
searchControl = new FormControl('');

ngOnInit() {
  this.searchControl.valueChanges
    .pipe(debounceTime(500))
    .subscribe(value => {
      this.doSearch(value);
    });
}

// ✅ Código limpo
// ✅ Usando RxJS (best practice)`,
    },
  ];

  customValidationExampleCode: CodeExample[] = [
    {
      label: 'Antigo (Limitado)',
      language: 'html',
      code: `<!-- Componente Antigo - Validações Limitadas -->
<sq-input
  [(value)]="passwordValue"
  [type]="'password'"
  [label]="'Senha'"
  [required]="true"
></sq-input>

<!-- ❌ Apenas validações básicas built-in -->
<!-- ❌ Não aceita validators customizados -->
<!-- ❌ Sem acesso aos erros -->`,
    },
    {
      label: 'Novo (Flexível)',
      language: 'html',
      code: `<!-- Componente Novo - Validators Customizados -->
<sq-input-form-control
  [formControl]="passwordControl"
  [type]="'password'"
  [label]="'Senha'"
></sq-input-form-control>

<sq-validation-message
  [control]="passwordControl"
></sq-validation-message>

<!-- Validação customizada de força da senha -->
<div class="password-strength">
  <div class="strength-bar" 
       [style.width.%]="getPasswordStrength()"
       [style.background]="getPasswordColor()">
  </div>
</div>

<!-- ✅ Validators customizados -->
<!-- ✅ Feedback visual customizado -->`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `import { FormControl, AbstractControl, ValidationErrors, Validators } from '@angular/forms';

// Validator customizado de força da senha
passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*()]/.test(value);
  
  const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  
  return !passwordValid ? { weakPassword: true } : null;
}

// Aplicar validator
passwordControl = new FormControl('', [
  Validators.required,
  Validators.minLength(8),
  this.passwordStrengthValidator
]);

// Calcular força da senha
getPasswordStrength(): number {
  // retorna 0-100
}`,
    },
  ];

  directiveExampleCode: CodeExample[] = [
    {
      label: 'Sem Diretiva (Manual)',
      language: 'html',
      code: `<!-- SEM a diretiva - Manual -->
<sq-input-form-control
  [formControl]="emailControl"
  [label]="'Email'"
  [type]="'email'"
></sq-input-form-control>

<!-- Precisa adicionar manualmente -->
<sq-validation-message
  [control]="emailControl"
  [fieldName]="'Email'"
></sq-validation-message>

<!-- ❌ Repetitivo para cada campo -->
<!-- ❌ Fácil esquecer de adicionar -->
<!-- ❌ Sem controle sobre mensagens -->`,
    },
    {
      label: 'Com Diretiva (Básico)',
      language: 'html',
      code: `<!-- COM a diretiva sqValidation - Automático! -->
<sq-input-form-control
  [formControl]="emailControl"
  [label]="'Email'"
  [type]="'email'"
  sqValidation
  [fieldName]="'Email'"
></sq-input-form-control>

<!-- ✅ Validação anexada automaticamente! -->
<!-- ✅ Aparece após blur (touched) por padrão -->
<!-- ✅ Mais limpo e menos código -->

<!-- Mostrar durante digitação -->
<sq-input-form-control
  [formControl]="passwordControl"
  [label]="'Senha'"
  sqValidation
  [fieldName]="'Senha'"
  [showWhen]="'dirty'"
></sq-input-form-control>
<!-- ✅ Aparece enquanto você digita! -->`,
    },
    {
      label: 'Mensagens Customizadas',
      language: 'html',
      code: `<!-- Com MENSAGENS CUSTOMIZADAS! -->
<sq-input-form-control
  [formControl]="emailControl"
  [label]="'Email'"
  [type]="'email'"
  sqValidation
  [fieldName]="'Email'"
  [customErrorMessages]="{
    required: '⚠️ Este campo não pode ficar vazio!',
    email: '📧 Email inválido (exemplo: nome@empresa.com)'
  }"
></sq-input-form-control>

<!-- ✅ Mensagens personalizadas por tipo de erro! -->
<!-- ✅ Suporta interpolação: {requiredLength}, {min}, {max} -->
<!-- ✅ Funciona com QUALQUER validator -->`,
    },
    {
      label: 'Template Customizado',
      language: 'html',
      code: `<!-- Template TOTALMENTE customizado! -->
<sq-input-form-control
  [formControl]="emailControl"
  [label]="'Email'"
  sqValidation
  [fieldName]="'Email'"
  [validationMessageTemplate]="myCustomTemplate"
></sq-input-form-control>

<!-- Template com acesso total aos erros -->
<ng-template #myCustomTemplate 
  let-errors 
  let-control="control" 
  let-message="errorMessage"
  let-fieldName="fieldName">
  
  <div class="my-custom-error-box">
    <div class="error-header">
      <i class="fa-solid fa-exclamation-circle"></i>
      <strong>Erro no campo {{ fieldName }}</strong>
    </div>
    <div class="error-body">
      {{ message }}
    </div>
    <div class="error-footer">
      <small>Código: {{ errors | json }}</small>
    </div>
  </div>
</ng-template>

<!-- ✅ Controle TOTAL sobre o HTML -->
<!-- ✅ Acesso aos erros, controle e mensagem -->
<!-- ✅ Perfeito para design systems customizados -->`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `import { FormControl, Validators } from '@angular/forms';
import { InputValidators } from '@squidit/ngx-css';

// 1. Mensagens customizadas (reutilizáveis)
customMessages = {
  required: '⚠️ Campo obrigatório!',
  email: '📧 Email inválido (use: nome@empresa.com)',
  minlength: '📏 Mínimo {requiredLength} caracteres',
  maxlength: '📏 Máximo {requiredLength} caracteres',
  cpf: '🆔 CPF inválido. Verifique os dígitos',
  cnpj: '🏢 CNPJ inválido',
  pattern: '🔍 Formato inválido'
};

// 2. Crie seus FormControls normalmente
emailControl = new FormControl('', [
  Validators.required,
  Validators.email
]);

cpfControl = new FormControl('', [
  Validators.required,
  InputValidators.cpf()
]);

passwordControl = new FormControl('', [
  Validators.required,
  Validators.minLength(8)
]);

// 3. A diretiva cuida do resto!
// - Observa o estado do controle
// - Cria o componente de validação automaticamente
// - Usa suas mensagens customizadas
// - Atualiza quando o estado muda
// - Remove quando não há mais erros

// 4. Funciona com QUALQUER componente de formulário!
// - sq-input-form-control
// - sq-textarea (em breve)
// - sq-select (em breve)
// - Qualquer ControlValueAccessor`,
    },
  ];
}
