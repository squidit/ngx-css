import { AfterViewInit, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqInputFormControlComponent } from '../../../../../src/components/sq-input-form-control/sq-input-form-control.component';
import { SqValidationDirective } from '../../../../../src/directives/sq-validation.directive';
import { InputValidators } from '../../../../../src/validators/input.validators';
import { CodeTabsComponent, CodeExample } from '../code-tabs/code-tabs.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-input-demonstration-example',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SqInputFormControlComponent,
    SqValidationDirective,
    CodeTabsComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './input-demonstration-example.component.html',
  styleUrls: ['./input-demonstration-example.component.scss'],
})
export class InputDemonstrationExampleComponent implements AfterViewInit {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', route: '/components-index', icon: 'fas fa-home' },
    { label: 'Demonstração de Input', icon: 'fas fa-keyboard' },
  ];

  // ============================================
  // SEÇÃO 1: Validações Básicas
  // ============================================
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  phoneControl = new FormControl('', [Validators.required]);
  urlControl = new FormControl('', [Validators.required]);

  emailValidations = {
    required: 'Email é obrigatório',
    email: 'Email inválido',
  };

  phoneValidations = {
    required: 'Telefone é obrigatório',
  };

  urlValidations = {
    required: 'URL é obrigatória',
    pattern: 'URL inválida',
  };

  // ============================================
  // SEÇÃO 2: Validações Brasileiras (CPF/CNPJ)
  // ============================================
  cpfControl = new FormControl('', [Validators.required, InputValidators.cpf()]);
  cnpjControl = new FormControl('', [Validators.required, InputValidators.cnpj()]);

  cpfValidations = {
    required: 'CPF é obrigatório',
    cpf: 'CPF inválido',
  };

  cnpjValidations = {
    required: 'CNPJ é obrigatório',
    cnpj: 'CNPJ inválido',
  };

  // ============================================
  // SEÇÃO 3: Formulário Completo
  // ============================================
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required, Validators.minLength(10)]),
  });

  nameValidations = {
    required: 'Nome é obrigatório',
    minlength: 'Nome deve ter no mínimo 3 caracteres',
  };

  userFormEmailValidations = {
    required: 'Email é obrigatório',
    email: 'Email inválido',
  };

  userFormPhoneValidations = {
    required: 'Telefone é obrigatório',
  };

  messageValidations = {
    required: 'Mensagem é obrigatória',
    minlength: 'Mensagem deve ter no mínimo 10 caracteres',
  };

  // ============================================
  // SEÇÃO 4: Estados e Customizações
  // ============================================
  disabledControl = new FormControl({ value: 'Campo desabilitado', disabled: true });
  readonlyControl = new FormControl({ value: 'Campo somente leitura', disabled: false });

  // ============================================
  // SEÇÃO 5: Debounce / timeToChange
  // ============================================
  searchControl = new FormControl('');
  searchResults: string[] = [];

  // ============================================
  // SEÇÃO 6: Validação Customizada
  // ============================================
  usernameControl = new FormControl('', [Validators.required, Validators.minLength(3), this.usernameValidator]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]);

  usernameValidations = {
    required: 'Username é obrigatório',
    minlength: 'Username deve ter no mínimo 3 caracteres',
    hasSpace: 'Username não pode conter espaços',
    hasSpecialChar: 'Username não pode conter caracteres especiais',
  };

  passwordValidations = {
    required: 'Senha é obrigatória',
    minlength: 'Senha deve ter no mínimo 8 caracteres',
    weakPassword: 'Senha muito fraca. Use maiúsculas, minúsculas, números e caracteres especiais',
  };

  // ============================================
  // MÉTODOS
  // ============================================

  ngAfterViewInit(): void {
    this.emailControl.markAsTouched();
    this.phoneControl.markAsTouched();

    setTimeout(() => {
      this.emailControl.markAsUntouched();
    }, 10000);
  }
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
   * Submit do formulário
   */
  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form submitted:', this.userForm.value);
      alert('Formulário enviado com sucesso! Veja o console.');
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
      this.markFormGroupTouched(this.userForm);
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
   * Reseta o formulário
   */
  resetForm() {
    this.userForm.reset();
  }

  /**
   * Preenche o formulário com dados de exemplo
   */
  fillForm() {
    this.userForm.patchValue({
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      phone: '11987654321',
      message: 'Esta é uma mensagem de exemplo para testar o formulário.',
    });
  }
}
